/**
 * Formula engine
 * ----------------
 * Transformation rules are stored as a small JSON AST rather than a raw
 * string, so evaluation is safe (no eval()) and every node type is
 * explicit about what it does. This mirrors what the frontend's
 * click-to-build formula editor is composing visually.
 *
 * Node shapes:
 *   { field: "Hours" }                                   -> read a column from the current row
 *   { literal: 8 }                                        -> a constant
 *   { op: "add" | "subtract" | "multiply" | "divide",
 *     args: [node, node, ...] }                            -> left-to-right fold, supports grouping via nesting
 *   { op: "concat", args: [node, node, ...] }               -> merges any number of columns/literals into one string
 *   { op: "round", args: [node, node?] }                    -> round(value, decimals=0)
 *   { op: "min" | "max", args: [node, node, ...] }
 *   { op: "if", cond: conditionNode, then: node, else: node }
 *   { op: "lookup",
 *     matchField: "Department",                            -> field on the CURRENT (primary) row
 *     refSheet: "Rates",                                    -> nickname of a reference file, as uploaded
 *     refKeyField: "Department",                             -> field to match against on the reference row
 *     refReturnField: "OvertimeMultiplier" }                 -> field to pull back once matched
 *
 * conditionNode: { cmp: "gt"|"gte"|"lt"|"lte"|"eq"|"neq", left: node, right: node }
 */

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function evaluate(node, row, context) {
  if (node == null) return null;

  if ("literal" in node) return node.literal;

  if ("field" in node) {
    // Supports "Sheet.Field" references directly on the current row too,
    // for callers that flatten a joined row before evaluating.
    return row[node.field];
  }

  if (node.op === "add" || node.op === "subtract" || node.op === "multiply" || node.op === "divide") {
    const values = node.args.map((a) => toNumber(evaluate(a, row, context)));
    return values.reduce((acc, v, i) => {
      if (i === 0) return v;
      if (node.op === "add") return acc + v;
      if (node.op === "subtract") return acc - v;
      if (node.op === "multiply") return acc * v;
      if (node.op === "divide") return v === 0 ? acc : acc / v;
      return acc;
    }, 0);
  }

  if (node.op === "concat") {
    return node.args.map((a) => {
      const v = evaluate(a, row, context);
      return v === null || v === undefined ? "" : String(v);
    }).join("");
  }

  if (node.op === "round") {
    const value = toNumber(evaluate(node.args[0], row, context));
    const decimals = node.args[1] ? toNumber(evaluate(node.args[1], row, context)) : 0;
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  if (node.op === "min" || node.op === "max") {
    const values = node.args.map((a) => toNumber(evaluate(a, row, context)));
    return node.op === "min" ? Math.min(...values) : Math.max(...values);
  }

  if (node.op === "if") {
    return evaluateCondition(node.cond, row, context)
      ? evaluate(node.then, row, context)
      : evaluate(node.else, row, context);
  }

  if (node.op === "lookup") {
    const { matchField, refSheet, refKeyField, refReturnField } = node;
    const refRows = (context.references && context.references[refSheet]) || [];
    const matchValue = row[matchField];
    const hit = refRows.find((r) => String(r[refKeyField]) === String(matchValue));
    return hit ? hit[refReturnField] : null;
  }

  throw Object.assign(new Error(`Unknown formula node: ${JSON.stringify(node)}`), { status: 400 });
}

function evaluateCondition(cond, row, context) {
  const left = evaluate(cond.left, row, context);
  const right = evaluate(cond.right, row, context);
  const l = Number.isNaN(Number(left)) ? left : Number(left);
  const r = Number.isNaN(Number(right)) ? right : Number(right);
  switch (cond.cmp) {
    case "gt": return l > r;
    case "gte": return l >= r;
    case "lt": return l < r;
    case "lte": return l <= r;
    case "eq": return l === r;
    case "neq": return l !== r;
    default: throw Object.assign(new Error(`Unknown comparator: ${cond.cmp}`), { status: 400 });
  }
}

/**
 * Applies a full ordered list of active transformation rules to one row.
 * Rules run in priority order and each rule's output is written back onto
 * the row immediately, so a later rule can reference an earlier rule's
 * target field (e.g. "Tax" reading the "Total Pay" a previous rule wrote).
 */
function applyRules(row, rules, context) {
  const output = { ...row };
  const sortedRules = [...rules].filter((r) => r.active).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  const log = [];
  for (const rule of sortedRules) {
    try {
      const value = evaluate(rule.formula, output, context);
      output[rule.target] = value;
      log.push({ rule: rule.name, target: rule.target, value });
    } catch (err) {
      log.push({ rule: rule.name, target: rule.target, error: err.message });
    }
  }
  return { row: output, log };
}

module.exports = { evaluate, evaluateCondition, applyRules };
