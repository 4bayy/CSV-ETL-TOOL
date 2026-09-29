const express = require("express");
const filesRoutes = require("./files.routes");
const workflowsRoutes = require("./workflows.routes");
const runsRoutes = require("./runs.routes");

const router = express.Router();

router.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

router.use("/files", filesRoutes);
router.use("/workflows", workflowsRoutes);
router.use("/", runsRoutes); // exposes /workflows/:id/run, /runs, /runs/:id, /runs/:id/download

module.exports = router;
