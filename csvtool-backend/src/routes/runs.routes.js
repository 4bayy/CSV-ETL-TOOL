const express = require("express");
const db = require("../store/db");
const { executeWorkflow, createRunRecord } = require("../services/runService");
const { toCsv } = require("../services/csvService");

const router = express.Router();

/**
 * POST /api/workflows/:id/run
 * body: { fileId?: string, useVersion?: boolean }
 *
 * Runs the workflow's current config (or, if useVersion is true, its most
 * recently published version) against a primary file. If fileId is omitted,
 * falls back to the workflow's configured primaryFileId.
 */
router.post("/workflows/:id/run", (req, res, next) => {
  try {
    const wf = db.workflows.get(req.params.id);
    if (!wf) return res.status(404).json({ error: "Workflow not found" });

    let config = wf;
    let versionId = null;
    if (req.body.useVersion) {
      if (!wf.currentVersionId) return res.status(400).json({ error: "Workflow has no published version yet" });
      config = db.versions.get(wf.currentVersionId);
      versionId = config.id;
    }

    const fileId = req.body.fileId || config.primaryFileId;
    const primaryFile = db.files.get(fileId);
    if (!primaryFile) return res.status(400).json({ error: "No primary file found to run against" });

    const referenceFiles = (config.referenceFileIds || [])
      .map((id) => db.files.get(id))
      .filter(Boolean);

    const startedAt = Date.now();
    const result = executeWorkflow({ workflow: config, primaryFile, referenceFiles });
    const durationMs = Date.now() - startedAt;

    const run = createRunRecord({
      workflowId: wf.id,
      versionId,
      fileId: primaryFile.id,
      result,
      durationMs,
    });

    res.status(201).json({
      id: run.id,
      status: run.status,
      records: run.records,
      passed: run.passed,
      warnings: run.warnings,
      failed: run.failed,
      durationMs: run.durationMs,
      issues: run.issues.slice(0, 200), // cap payload; full list via /runs/:id/errors
      preview: run.outputRows.slice(0, 10),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/runs", (_req, res) => {
  const runs = db.runs.list().map(({ outputRows, transformLog, issues, ...summary }) => ({
    ...summary,
    issueCount: issues.length,
  }));
  res.json(runs);
});

router.get("/runs/:id", (req, res) => {
  const run = db.runs.get(req.params.id);
  if (!run) return res.status(404).json({ error: "Run not found" });
  const { outputRows, ...rest } = run;
  res.json({ ...rest, preview: outputRows.slice(0, 20) });
});

/** GET /api/runs/:id/download — the fully processed dataset as CSV. */
router.get("/runs/:id/download", (req, res) => {
  const run = db.runs.get(req.params.id);
  if (!run) return res.status(404).json({ error: "Run not found" });
  const csv = toCsv(run.outputRows);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="run_${run.id}_output.csv"`);
  res.send(csv);
});

/** GET /api/runs/:id/errors/download — just the failed/warned rows, as CSV. */
router.get("/runs/:id/errors/download", (req, res) => {
  const run = db.runs.get(req.params.id);
  if (!run) return res.status(404).json({ error: "Run not found" });
  const csv = toCsv(run.issues);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="run_${run.id}_errors.csv"`);
  res.send(csv);
});

module.exports = router;
