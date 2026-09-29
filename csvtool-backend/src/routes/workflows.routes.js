const express = require("express");
const db = require("../store/db");

const router = express.Router();

/**
 * POST /api/workflows
 * body: { name, description, primaryFileId, referenceFileIds: [], mapping: {}, destination }
 * transformRules and validationRules can be set here or via PATCH as the builder progresses.
 */
router.post("/", (req, res) => {
  const {
    name = "Untitled workflow",
    description = "",
    primaryFileId = null,
    referenceFileIds = [],
    mapping = {},
    transformRules = [],
    validationRules = [],
    destination = "csv",
  } = req.body;

  const workflow = db.workflows.create({
    name,
    description,
    primaryFileId,
    referenceFileIds,
    mapping,
    transformRules,
    validationRules,
    destination,
    status: "Draft",
    currentVersion: 0,
  });
  res.status(201).json(workflow);
});

router.get("/", (_req, res) => res.json(db.workflows.list()));

router.get("/:id", (req, res) => {
  const wf = db.workflows.get(req.params.id);
  if (!wf) return res.status(404).json({ error: "Workflow not found" });
  res.json(wf);
});

/** PATCH /api/workflows/:id — partial update to any builder-stage config (mapping, rules, destination, etc). */
router.patch("/:id", (req, res) => {
  const wf = db.workflows.get(req.params.id);
  if (!wf) return res.status(404).json({ error: "Workflow not found" });
  const updated = db.workflows.update(req.params.id, req.body);
  res.json(updated);
});

/**
 * POST /api/workflows/:id/publish
 * Snapshots the current config as an immutable version. Runs should always
 * reference a versionId, never "the current workflow", so past runs stay
 * reproducible even after the workflow is edited further.
 */
router.post("/:id/publish", (req, res) => {
  const wf = db.workflows.get(req.params.id);
  if (!wf) return res.status(404).json({ error: "Workflow not found" });

  const nextVersionNumber = wf.currentVersion + 1;
  const version = db.versions.create({
    workflowId: wf.id,
    number: nextVersionNumber,
    label: `v${nextVersionNumber}`,
    mapping: wf.mapping,
    transformRules: wf.transformRules,
    validationRules: wf.validationRules,
    destination: wf.destination,
    primaryFileId: wf.primaryFileId,
    referenceFileIds: wf.referenceFileIds,
    changeNotes: req.body.changeNotes || [],
  });

  const updated = db.workflows.update(req.params.id, {
    status: "Published",
    currentVersion: nextVersionNumber,
    currentVersionId: version.id,
  });

  res.status(201).json({ workflow: updated, version });
});

/** GET /api/workflows/:id/versions */
router.get("/:id/versions", (req, res) => {
  const versions = db.versions.list((v) => v.workflowId === req.params.id).sort((a, b) => b.number - a.number);
  res.json(versions);
});

module.exports = router;
