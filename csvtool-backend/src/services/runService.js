const db = require("../store/db");
const { applyRules } = require("./formulaEngine");
const { validateRows } = require("./validationService");

/** Renames source columns to workflow field names, per the mapping config. */
function applyMapping(row, mapping) {
  // mapping: { sourceColumnName: workflowFieldName }
  const mapped = {};
  for (const [sourceCol, targetField] of Object.entries(mapping)) {
    if (!targetField || targetField === "-- Unmapped --") continue;
    mapped[targetField] = row[sourceCol];
  }
  return mapped;
}

/**
 * Executes a workflow (or a specific version of one) against an uploaded
 * primary file, using any reference files for LOOKUP-based rules.
 */
function executeWorkflow({ workflow, primaryFile, referenceFiles = [] }) {
  const references = {};
  for (const ref of referenceFiles) {
    references[ref.nickname || ref.name] = ref.rows;
  }
  const context = { references };

  const mappedRows = primaryFile.rows.map((row) => applyMapping(row, workflow.mapping || {}));

  const transformedRows = [];
  const transformLog = [];
  for (const row of mappedRows) {
    const { row: output, log } = applyRules(row, workflow.transformRules || [], context);
    transformedRows.push(output);
    transformLog.push(log);
  }

  const { issues, summary } = validateRows(transformedRows, workflow.validationRules || []);

  return { rows: transformedRows, issues, summary, transformLog };
}

/** Persists a run record (used by the /runs routes for history + download). */
function createRunRecord({ workflowId, versionId, fileId, result, durationMs }) {
  return db.runs.create({
    workflowId,
    versionId,
    fileId,
    status: result.summary.errors > 0 ? "Failed" : result.summary.warnings > 0 ? "Warning" : "Success",
    records: result.summary.total,
    passed: result.summary.passed,
    warnings: result.summary.warnings,
    failed: result.summary.total - result.summary.passed,
    durationMs,
    outputRows: result.rows,
    issues: result.issues,
    transformLog: result.transformLog,
    startedAt: new Date().toISOString(),
  });
}

module.exports = { applyMapping, executeWorkflow, createRunRecord };
