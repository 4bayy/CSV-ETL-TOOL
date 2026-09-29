# csvtool-backend

Express backend for a CSV/Excel import → mapping → transformation → validation → run
pipeline. Built to sit behind the FlowForge-style frontend: upload a primary file plus
any number of reference sheets, map columns, define transformation rules (including
formulas that combine multiple columns and cross-sheet LOOKUPs), validate, run, and
download the result.

## Setup

```bash
npm install
cp .env.example .env
npm run dev      # or: npm start
```

Server listens on `http://localhost:4000` by default. All endpoints are under `/api`.

## Architecture

```
src/
  server.js            entry point
  app.js               express app, middleware wiring
  config/               env config
  middleware/
    upload.js           multer disk storage config
    errorHandler.js
  store/
    db.js                in-memory repositories (swap for a real DB later —
                          this is the only file that would need to change)
  services/
    csvService.js        parse CSV/XLSX -> rows, serialize rows -> CSV
    formulaEngine.js      evaluates transformation rules (AST, no eval())
    validationService.js  runs validation rules against processed rows
    runService.js         orchestrates mapping -> transform -> validate
  routes/
    files.routes.js       upload/inspect files
    workflows.routes.js   create/configure/publish workflows
    runs.routes.js        execute workflows, fetch/download results
```

This is a prototype backend: data lives in memory and resets on restart. The
`store/db.js` module is intentionally the only place touching that in-memory Map, so
swapping it for Postgres/SQL Server/Mongo later doesn't require touching any route or
service code.

## Formula rules are an AST, not a string

The frontend's click-to-build formula editor composes a formula visually. On this
backend, a transformation rule's `formula` field is a small JSON AST rather than a raw
expression string — this keeps evaluation safe (no `eval`) and makes every operation
explicit. See `services/formulaEngine.js` for the full node reference. Summary:

| Node | Meaning |
|---|---|
| `{ field: "Hours" }` | read a column from the row |
| `{ literal: 8 }` | a constant |
| `{ op: "add"\|"subtract"\|"multiply"\|"divide", args: [...] }` | arithmetic, left-to-right, nest for grouping |
| `{ op: "concat", args: [...] }` | merge any number of columns/literals into one string |
| `{ op: "round"\|"min"\|"max", args: [...] }` | |
| `{ op: "if", cond, then, else }` | conditional |
| `{ op: "lookup", matchField, refSheet, refKeyField, refReturnField }` | cross-sheet join |

## Worked example: mapping + multi-column formula + cross-sheet lookup + merge

**1. Upload the primary file**

```bash
curl -F "file=@employees.csv" -F "role=Primary" http://localhost:4000/api/files
# -> { id: "file_abc123", name: "employees.csv", records: 10240, schema: [...] }
```

**2. Upload a reference sheet** (e.g. a rate table used for LOOKUP)

```bash
curl -F "file=@rate_table.csv" -F "role=Reference" -F "nickname=Rates" http://localhost:4000/api/files
# -> { id: "file_def456", nickname: "Rates", schema: [...] }
```

**3. Create the workflow**

```bash
curl -X POST http://localhost:4000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employee Payroll Processing",
    "primaryFileId": "file_abc123",
    "referenceFileIds": ["file_def456"],
    "mapping": {
      "employee_id": "Employee ID",
      "first_name": "First Name",
      "last_name": "Last Name",
      "hours": "Hours",
      "rate": "Hourly Rate",
      "department": "Department"
    },
    "transformRules": [
      {
        "id": "r1", "name": "Calculate Total Pay", "target": "Total Pay", "priority": 1, "active": true,
        "formula": { "op": "multiply", "args": [ { "field": "Hours" }, { "field": "Hourly Rate" } ] }
      },
      {
        "id": "r2", "name": "Calculate Overtime", "target": "Overtime", "priority": 2, "active": true,
        "formula": {
          "op": "if",
          "cond": { "cmp": "gt", "left": { "field": "Hours" }, "right": { "literal": 8 } },
          "then": { "op": "multiply", "args": [ { "op": "subtract", "args": [ { "field": "Hours" }, { "literal": 8 } ] }, { "field": "Hourly Rate" } ] },
          "else": { "literal": 0 }
        }
      },
      {
        "id": "r3", "name": "Merge Full Name", "target": "Full Name", "priority": 3, "active": true,
        "formula": { "op": "concat", "args": [ { "field": "First Name" }, { "literal": " " }, { "field": "Last Name" } ] }
      },
      {
        "id": "r4", "name": "Apply Regional Multiplier", "target": "Adjusted Pay", "priority": 4, "active": true,
        "formula": {
          "op": "multiply",
          "args": [
            { "field": "Total Pay" },
            { "op": "lookup", "matchField": "Department", "refSheet": "Rates", "refKeyField": "department", "refReturnField": "overtime_multiplier" }
          ]
        }
      }
    ],
    "validationRules": [
      { "id": "v1", "label": "Email must be valid", "field": "Email", "type": "email", "severity": "Warning", "active": true },
      { "id": "v2", "label": "Hours must be greater than 0", "field": "Hours", "type": "number_range", "config": { "min": 0.01 }, "severity": "Error", "active": true },
      { "id": "v3", "label": "Employee ID is required", "field": "Employee ID", "type": "required", "severity": "Error", "active": true }
    ]
  }'
# -> { id: "wf_xyz789", ... }
```

**4. Run it**

```bash
curl -X POST http://localhost:4000/api/workflows/wf_xyz789/run \
  -H "Content-Type: application/json" -d '{}'
# -> { id: "run_...", status: "Warning", records: 10240, passed: 9982, warnings: 18, failed: 0, preview: [...] }
```

**5. Download the processed output, or just the error rows**

```bash
curl -o output.csv http://localhost:4000/api/runs/run_.../download
curl -o errors.csv http://localhost:4000/api/runs/run_.../errors/download
```

**6. Publish a version** once you're happy with the config (runs can then reference an
immutable version instead of "whatever the workflow currently looks like"):

```bash
curl -X POST http://localhost:4000/api/workflows/wf_xyz789/publish \
  -H "Content-Type: application/json" \
  -d '{ "changeNotes": ["Added regional multiplier lookup", "Added full name merge"] }'
```

## Full endpoint reference

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | liveness check |
| POST | `/api/files` | upload a file (`multipart/form-data`, field `file`; body `role`, `nickname`) |
| GET | `/api/files` | list uploaded files |
| GET | `/api/files/:id` | file detail + detected schema |
| GET | `/api/files/:id/preview?limit=20` | sample of parsed rows |
| PATCH | `/api/files/:id/schema` | edit detected schema (rename/retype/require) |
| DELETE | `/api/files/:id` | remove a file |
| POST | `/api/workflows` | create a workflow (mapping, rules, destination) |
| GET | `/api/workflows` | list workflows |
| GET | `/api/workflows/:id` | workflow detail |
| PATCH | `/api/workflows/:id` | update any part of the config |
| POST | `/api/workflows/:id/publish` | snapshot current config as a new immutable version |
| GET | `/api/workflows/:id/versions` | list published versions |
| POST | `/api/workflows/:id/run` | execute against a file (`fileId` optional, `useVersion` optional) |
| GET | `/api/runs` | list run history |
| GET | `/api/runs/:id` | run detail + preview rows |
| GET | `/api/runs/:id/download` | processed output as CSV |
| GET | `/api/runs/:id/errors/download` | validation issues as CSV |

## Notes on taking this to production

- Swap `store/db.js` for a real database and scope every collection by `workspaceId`
  once auth/multi-tenancy is added (see the tenant-scoping approach discussed earlier —
  a global query filter keyed on workspace is the cleanest fit here too).
- Move file parsing + rule execution onto a background job queue (e.g. BullMQ) for
  large files instead of running synchronously inside the request handler.
- Add auth middleware (JWT bearer) in front of every route in `routes/index.js`.
- The `custom` validation rule type and full `IF`/condition parity with the frontend's
  visual condition builder are stubbed — wire `validationService.js`'s `custom` case to
  `formulaEngine.evaluateCondition` once custom rules are persisted as condition ASTs.
