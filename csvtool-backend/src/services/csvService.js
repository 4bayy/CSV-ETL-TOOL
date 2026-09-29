const fs = require("fs");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const XLSX = require("xlsx");
const path = require("path");

/**
 * Parses an uploaded file (CSV or Excel) from disk into an array of
 * plain row objects, keyed by header name.
 */
function parseFile(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === ".csv" || ext === ".tsv" || ext === ".txt") {
    const raw = fs.readFileSync(filePath, "utf8");
    const delimiter = ext === ".tsv" ? "\t" : ",";
    const rows = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter,
    });
    return rows;
  }

  if (ext === ".xlsx" || ext === ".xls") {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
    return rows;
  }

  throw Object.assign(new Error(`Unsupported file type: ${ext || "(none)"}`), { status: 400 });
}

/** Serializes processed rows back to a CSV string for download. */
function toCsv(rows) {
  if (!rows.length) return "";
  return stringify(rows, { header: true });
}

module.exports = { parseFile, toCsv };
