import React from "react";

function WorkflowCard() {
  return (
    <div className="p-3">
      {/*  card  */}
      <div className="bg-white w-full px-4 py-6 ">
        {/*  Header */}
        <div>
          <div className="flex justify-between ">
            <div>
              <h1 className="text-md font-bold text-slate-900">
                Employee Processing Workflow
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Process employee payroll data from CSV files.{" "}
              </p>
            </div>
            <div className="mr-14">
              <span className="gap-2 rounded-lg bg-green-100 px-5 py-3 text-sm font-medium text-green-500 transition">
                Published
              </span>
            </div>
          </div>
        </div>
        {/*  satatus */}
        <div className="grid grid-cols-2 mt-14">
          <div className="flex flex-col p-2">
            <span className="text-gray-400">Source</span>
            <span>CSV</span>
          </div>
          <div className="flex flex-col p-2">
            <span className="text-gray-400">Steps</span>
            <span>6</span>
          </div>
          <div className="flex flex-col p-2">
            <span className="text-gray-400">Last Run</span>
            <span>2 hours ago</span>
          </div>
          <div className="flex flex-col p-2">
            <span className="text-gray-400">Version</span>
            <span>v3</span>
          </div>
        </div>
        <button className="w-full mt-2 rounded-lg border border-gray-300 hover:bg-green-50"> Open</button>
      </div>
    </div>
  );
}

export default WorkflowCard;

// <div className="flex justify-between w-full  rounded-2xl bg-white">
//           <div>
//             <h1 className="text-md font-bold text-slate-900">
//               Employee Processing Workflow
//             </h1>
//             <p className="mt-1 text-sm text-slate-500">
//               Process employee payroll data from CSV files.
//             </p>
//           </div>
//           <div className="mr-14">
//             <span className="flex items-center justify-center    gap-2 rounded-lg bg-green-100 px-5 py-3 text-sm font-medium text-green-500 transition">
//               Published
//             </span>
//           </div>
//         </div>
//          <div>
//             <div></div>
//             <div></div>
//             <button className=""> open</button>
//         </div>
