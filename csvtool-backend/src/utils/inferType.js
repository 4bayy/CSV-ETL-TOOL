const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?)?$/;

/**
 * Looks at a sample of values for one column and guesses its type.
 * Mirrors the "Data Type" column shown on the frontend's Schema step.
 */
function inferColumnType(values) {
  const sample = values.filter((v) => v !== null && v !== undefined && String(v).trim() !== "").slice(0, 50);
  if (sample.length === 0) return "String";

  if (sample.every((v) => EMAIL_RE.test(String(v)))) return "Email";
  if (sample.every((v) => DATE_RE.test(String(v)))) return "Date";
  if (sample.every((v) => v === "true" || v === "false" || typeof v === "boolean")) return "Boolean";
  if (sample.every((v) => v !== "" && !Number.isNaN(Number(v)))) return "Number";
  return "String";
}

/**
 * Builds the schema array (one entry per column) the same shape the
 * frontend's SchemaStage table expects: name, type, required, sample.
 */
function detectSchema(rows) {
  if (!rows.length) return [];
  const columnNames = Object.keys(rows[0]);
  return columnNames.map((name, i) => {
    const values = rows.map((r) => r[name]);
    const nonEmptyCount = values.filter((v) => v !== null && v !== undefined && String(v).trim() !== "").length;
    return {
      id: `c${i + 1}`,
      name,
      type: inferColumnType(values),
      required: nonEmptyCount === values.length, // every row has a value -> looks required
      sample: String(values.find((v) => v !== null && v !== undefined && String(v).trim() !== "") ?? ""),
    };
  });
}

module.exports = { inferColumnType, detectSchema };
