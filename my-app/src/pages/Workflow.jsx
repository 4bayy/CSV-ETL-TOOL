import React, { useEffect, useState } from "react";
import WorkflowCard from "../components/WorkflowCard.";
import CreateWorkflow from "../components/CreateWorkflow";
import WorkflowHistory from "../components/WorkflowHistory";

function Workflow() {
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  const ToolBar = ["All", "Active", "Published", "NonActive"];

  return (
    <main>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Workflows</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create resuable data processing workflows
            </p>
          </div>
          <div>
            <button
              className="flex items-center justify-center  cursor-pointer gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              onClick={() => setIsWorkflowOpen(true)}
            >
              Create Workflow
            </button>
          </div>
        </div>
        {isWorkflowOpen ? <CreateWorkflow  onCancel={() => setIsWorkflowOpen(false)}  /> : <WorkflowHistory />}
      </div>
    </main>
  );
}

export default Workflow;
