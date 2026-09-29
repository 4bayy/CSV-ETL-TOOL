const express = require("express");
const upload = require("../middleware/upload");
const db = require("../store/db");
const { parseFile } = require("../services/csvService");
const { detectSchema } = require("../utils/inferType");

const router = express.Router();

/**
 * POST /api/files
 * multipart/form-data: file=<the CSV/Excel file>
 * body: role=Primary|Reference (default Primary), nickname=optional label used in LOOKUP formulas
 */
router.post("/", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Attach it under the 'file' field." });
    }
    const role = req.body.role === "Reference" ? "Reference" : "Primary";
    const nickname = req.body.nickname || null;

    const rows = parseFile(req.file.path, req.file.originalname);
    const schema = detectSchema(rows);

    const file = db.files.create({
      name: req.file.originalname,
      storedPath: req.file.path,
      role,
      nickname,
      records: rows.length,
      columnsCount: schema.length,
      schema,
      rows,
    });

    // Don't echo the full row set back on upload — schema + counts are
    // enough for the builder UI; rows are fetched separately if needed.
    const { rows: _omit, ...summary } = file;
    res.status(201).json(summary);
  } catch (err) {
    next(err);
  }
});

/** GET /api/files — list uploaded files (omits row data). */
router.get("/", (_req, res) => {
  const files = db.files.list().map(({ rows, ...rest }) => rest);
  res.json(files);
});

/** GET /api/files/:id — file detail including schema. */
router.get("/:id", (req, res) => {
  const file = db.files.get(req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });
  const { rows, ...summary } = file;
  res.json(summary);
});

/** GET /api/files/:id/preview?limit=20 — a sample of parsed rows. */
router.get("/:id/preview", (req, res) => {
  const file = db.files.get(req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });
  const limit = Math.min(Number(req.query.limit) || 20, 500);
  res.json({ columns: file.schema.map((c) => c.name), rows: file.rows.slice(0, limit) });
});

/** PATCH /api/files/:id/schema — edit detected schema (rename/retype/require fields), as on the Schema step. */
router.patch("/:id/schema", (req, res) => {
  const file = db.files.get(req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });
  const { schema } = req.body;
  if (!Array.isArray(schema)) return res.status(400).json({ error: "Body must include a 'schema' array" });
  const updated = db.files.update(req.params.id, { schema });
  const { rows, ...summary } = updated;
  res.json(summary);
});

/** DELETE /api/files/:id */
router.delete("/:id", (req, res) => {
  const ok = db.files.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: "File not found" });
  res.status(204).end();
});

module.exports = router;
