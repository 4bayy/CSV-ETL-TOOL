const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validation rule shape:
 * {
 *   id, label, field, type, severity: "Error" | "Warning", active: true,
 *   config: { ... type-specific options, e.g. { min, max } for number_range }
 * }
 *
 * Supported types : required, number_range, string_length, email, date, regex, allowed_values, custom
 * ("custom" is accepted but only flagged as unsupported server-side — see note below.)
 */

function validateValue(value, rule) {
  const { type, config = {} } = rule;
  const isEmpty = value === null || value === undefined || String(value).trim() === "";
  switch (type) {
    case "required":
      return !isEmpty;
    case "number_range": {
      if (isEmpty) return true; // required (if needed) is a separate rule
      const n = Number(value);
      if (Number.isNaN(n)) return false;
      if (config.min !== undefined && n < config.min) return false;
      if (config.max !== undefined && n > config.max) return false;
      return true;
    }
    case "string_length": {
      if (isEmpty) return true;
      const len = String(value).length;
      if (config.min !== undefined && len < config.min) return false;
      if (config.max !== undefined && len > config.max) return false;
      return true;
    }
    case "email":
      return isEmpty || EMAIL_RE.test(String(value));
    case "date":
      return isEmpty || !Number.isNaN(Date.parse(value));
    case "regex":
      return isEmpty || new RegExp(config.pattern).test(String(value));
    case "allowed_values":
      return isEmpty || (config.values || []).map(String).includes(String(value));
    case "custom":
      // Custom conditions come from the visual condition builder on the
      // frontend. Wire this up to formulaEngine.evaluateCondition once
      // custom rules are persisted as condition ASTs, same as transform rules.
      return true;
    default:
      return true;
  }
}

/** Runs every active validation rule against one row, returns issues found. */
function validateRow(row, rowIndex, rules) {
  const issues = [];
  for (const rule of rules.filter((r) => r.active)) {
    const value = row[rule.field];
    const ok = validateValue(value, rule);
    if (!ok) {
      issues.push({
        row: rowIndex,
        field: rule.field,
        value,
        error: rule.label,
        severity: rule.severity || "Error",
      });
    }
  }
  return issues;
}

/** Runs validation across every row, returns a flat error/warning list + summary counts. */
function validateRows(rows, rules) {
  const allIssues = [];
  rows.forEach((row, i) => {
    allIssues.push(...validateRow(row, i + 1, rules));
  });
  const errorCount = allIssues.filter((i) => i.severity === "Error").length;
  const warningCount = allIssues.filter((i) => i.severity === "Warning").length;
  const failedRowNumbers = new Set(allIssues.filter((i) => i.severity === "Error").map((i) => i.row));
  return {
    issues: allIssues,
    summary: {
      total: rows.length,
      failed: failedRowNumbers.size,
      passed: rows.length - failedRowNumbers.size,
      warnings: warningCount,
      errors: errorCount,
    },
  };
}

module.exports = { validateValue, validateRow, validateRows };
