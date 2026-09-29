import { useState } from "react";
import WorkflowCard from "./WorkflowCard.";

function WorkflowHistory() {
  const [workflow, setWorkflow] = useState("");

  return (
    <main>
      {/*  Toolbar */}
      <div>
        <div className="flex">
          <input
            type="text"
            placeholder="Search For Workflows.."
            value={workflow}
            className="w-80 rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            onChange={(e) => setWorkflow(e.target.value)}
          ></input>

          <div className="gap-2 p-3 flex">
            {/* {ToolBar.map((tools)=>( */}
            <button className="flex items-center justify-center  cursor-pointer gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              All
            </button>
            <button className="flex items-center justify-center  cursor-pointer gap-2 border rounded-lg  px-5 py-3 text-sm font-medium text-black transition hover:bg-slate-800 hover:text-white">
              Published
            </button>
            <button className="flex items-center justify-center  cursor-pointer gap-2 border rounded-lg  px-5 py-3 text-sm font-medium text-black transition hover:bg-slate-800 hover:text-white">
              Active
            </button>
            <button className="flex items-center justify-center  cursor-pointer gap-2 border rounded-lg px-5 py-3 text-sm font-medium text-black transition hover:bg-slate-800 hover:text-white">
              NonActive
            </button>
            {/* ))} */}
            {/* <button > published</button>
            <button > Active</button> */}
          </div>
        </div>x``
      </div>
      {/*  workflow card section */}
      <div>
        <WorkflowCard></WorkflowCard>
        <WorkflowCard></WorkflowCard>
      </div>
    </main>
  );
}

export default WorkflowHistory;
