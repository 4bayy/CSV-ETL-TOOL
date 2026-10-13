import React, { useState } from "react";
import { Plus, Pencil, Copy, Trash2, X, ListChecks, Check } from "lucide-react";

const DEFAULT_FIELDS = [
  "employee_id",
  "first_name",
  "last_name",
  "hours",
  "rate",
  "email",
  "department",
  "start_date",
];
const DEFAULT_TARGETS = ["Total Pay", "Overtime", "Email", "Phone"];
const OPERATORS = ["+", "-", "×", "÷"];
const GROUPING = ["(", ")", ","];
const FUNCTIONS = ["IF", "ROUND", "MIN", "MAX", "CONCAT"];
const NON_VAR_TOKENS = [...OPERATORS, ...GROUPING, ...FUNCTIONS];
const isVarToken = (t) => !NON_VAR_TOKENS.includes(t);

const INITIAL_RULES = [
  {
    id: "r1",
    name: "Calculate Total Pay",
    target: "Total Pay",
    expr: "Hours × Hourly Rate",
    priority: 1,
    active: true,
  },
  {
    id: "r2",
    name: "Calculate Overtime",
    target: "Overtime",
    expr: "IF Hours > 8 THEN (Hours - 8) × Hourly Rate",
    priority: 2,
    active: true,
  },
  {
    id: "r3",
    name: "Normalize Email",
    target: "Email",
    expr: "LOWER(Email)",
    priority: 3,
    active: true,
  },
  {
    id: "r4",
    name: "Validate Phone",
    target: "Phone",
    expr: 'STRIP(Phone, "non-digits")',
    priority: 4,
    active: false,
  },
];

/* ---------------------------------------------------------------- */
/* Toggle switch                                                     */
/* ---------------------------------------------------------------- */
function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-indigo-600" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ---------------------------------------------------------------- */
/* Rule card                                                         */
/* ---------------------------------------------------------------- */
function RuleCard({ rule, onToggle, onEdit, onDuplicate, onDelete }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-gray-900">
            {rule.name}
          </div>
          <div className="mt-1 text-[13px] text-gray-400">
            Target: <span className="text-gray-500">{rule.target}</span>
          </div>
          <code className="mt-3 inline-block rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-[13px] text-gray-800">
            {rule.expr}
          </code>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-400">
              Priority {rule.priority}
            </span>
            <Toggle on={rule.active} onClick={() => onToggle(rule.id)} />
          </div>
          <div className="flex items-center gap-2.5 text-gray-400">
            <button
              onClick={() => onEdit(rule)}
              title="Edit"
              className="hover:text-gray-600"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDuplicate(rule)}
              title="Duplicate"
              className="hover:text-gray-600"
            >
              <Copy size={15} />
            </button>
            <button
              onClick={() => onDelete(rule.id)}
              title="Delete"
              className="hover:text-gray-600"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Create / edit transformation modal                                */
/* ---------------------------------------------------------------- */
function CreateTransformationModal({
  open,
  onClose,
  onSave,
  fields = DEFAULT_FIELDS,
  targets = DEFAULT_TARGETS,
}) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState(targets[0]);
  const [tokens, setTokens] = useState([]);
  const [testVals, setTestVals] = useState({});
  const [formula, setFormula] = useState("");

  if (!open) return null;

  const addToken = (t) => setTokens((cur) => [...cur, t]);
  const removeLast = () => setTokens((cur) => cur.slice(0, -1));

  const usesConcat = tokens.includes("CONCAT");
  const variables = [...new Set(tokens.filter(isVarToken))];
  const exprDisplay = tokens.length ? tokens.join(" ") : "—";
  const jsExpr = tokens
    .map((t) => {
      if (isVarToken(t)) return `[${t}]`;
      if (t === "×") return "*";
      if (t === "÷") return "/";
      return t;
    })
    .join(" ");

  let output = null;
  try {
    if (usesConcat) {
      const openIdx = tokens.indexOf("(");
      const closeIdx = tokens.lastIndexOf(")");
      if (openIdx !== -1 && closeIdx !== -1 && closeIdx > openIdx) {
        const inner = tokens.slice(openIdx + 1, closeIdx);
        output = inner
          .filter((t) => t !== ",")
          .map((t) => (isVarToken(t) ? String(testVals[t] ?? "") : t))
          .join("");
      }
    } else if (
      tokens.length &&
      !tokens.some((t) => ["IF", "ROUND", "MIN", "MAX"].includes(t))
    ) {
      const jsSafe = tokens
        .map((t) => {
          if (t === "(" || t === ")") return t;
          if (isVarToken(t)) return String(Number(testVals[t]) || 0);
          if (t === "×") return "*";
          if (t === "÷") return "/";
          return t;
        })
        .join(" ");
      // eslint-disable-next-line no-eval
      output = eval(jsSafe);
    }
  } catch {
    output = null;
  }

  const reset = () => {
    setName("");
    setTarget(targets[0]);
    setTokens([]);
    setTestVals({});
  };

  const handleSave = () => {
    onSave({
      id: `r${Date.now()}`,
      name: name || "Untitled rule",
      target,
      expr: exprDisplay,
      priority: 99,
      active: true,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Create transformation
          </h2>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Name + target */}
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Rule name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Calculate Total Pay"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Applies To (target field)
            </label>
            <div className="relative">
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {targets.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Available fields */}
        <div className="mb-5">
          <div className="mb-2 text-sm font-semibold text-gray-800">
            Select fields{" "}
            <span className="font-normal text-gray-400">
              — from the primary file
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {fields.map((f) => (
              <button
                key={f}
                onClick={() => addToken(f)}
                className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 font-mono text-[13px] font-medium text-indigo-600 hover:bg-indigo-100"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Formula builder area */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Formula
          </label>
          <textarea
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="Enter formula, e.g. Amount * 1.18 or UPPER(name)"
            rows={3}
            className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 font-mono text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-xs text-gray-500">
            Enter your transformation formula as plain text.
          </p>
        </div>

        {/* Generated expression */}
        <div className="mb-5 mt-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
          <div className="mb-1 text-[11px] text-gray-400">
            Generated expression
          </div>
          <code className="text-sm text-gray-800">{jsExpr || "—"}</code>
        </div>

        {/* Test input / output */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-3.5">
            <div className="mb-2.5 text-[11.5px] font-medium text-gray-400">
              Test input
            </div>
            {variables.length === 0 ? (
              <div className="text-[12px] text-gray-400">
                Add fields to test
              </div>
            ) : (
              <div className="space-y-2">
                {variables.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="truncate font-mono text-[12px] text-gray-600">
                      {f}
                    </span>
                    <input
                      type={usesConcat ? "text" : "number"}
                      value={testVals[f] ?? (usesConcat ? "" : 0)}
                      onChange={(e) =>
                        setTestVals((v) => ({
                          ...v,
                          [f]: usesConcat
                            ? e.target.value
                            : Number(e.target.value),
                        }))
                      }
                      className="w-24 shrink-0 rounded border border-gray-300 px-2 py-1 text-right font-mono text-[12.5px] text-gray-800 outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-lg bg-emerald-50 p-3.5">
            <div className="mb-2.5 text-[11.5px] font-medium text-emerald-700">
              Output
            </div>
            <div className="mb-1 text-[12.5px] text-gray-700">{target}</div>
            <div className="text-2xl font-semibold text-emerald-700">
              {output !== null &&
              !(typeof output === "number" && Number.isNaN(output))
                ? typeof output === "number"
                  ? output.toLocaleString()
                  : output || "—"
                : "—"}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="rounded-lg border border-gray-300 px-3.5 py-2 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 py-2 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50">
            <ListChecks size={15} />
            Validate formula
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-[13.5px] font-medium text-white hover:bg-indigo-700"
          >
            <Check size={15} />
            Save rule
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Page: rule list + "Add transformation" entry point                */
/* ---------------------------------------------------------------- */
export default function TransformationRules() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [modalOpen, setModalOpen] = useState(false);

  const toggle = (id) =>
    setRules((r) =>
      r.map((x) => (x.id === id ? { ...x, active: !x.active } : x)),
    );
  const remove = (id) => setRules((r) => r.filter((x) => x.id !== id));
  const duplicate = (rule) =>
    setRules((r) => [
      ...r,
      { ...rule, id: `r${Date.now()}`, name: `${rule.name} (copy)` },
    ]);
  const addRule = (rule) => setRules((r) => [...r, rule]);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transformation rules
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Define how your data should be calculated, cleaned, or modified.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add transformation
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            onToggle={toggle}
            onEdit={() => setModalOpen(true)}
            onDuplicate={duplicate}
            onDelete={remove}
          />
        ))}
      </div>

      <CreateTransformationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addRule}
      />
    </div>
  );
}
