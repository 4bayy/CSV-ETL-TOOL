import React, { useEffect, useRef, useState } from "react";
import FileUpload from "./FileUpload";
import UploadSetup from "./UploadSetup";
import useCsvStore from "../store/store";
import SchemaFlow from "./SchemaFlow";
import TransformStage from "./TransformationPage";

export const flowvalues = [
  { title: "1", value: "Source" },
  { title: "2", value: "Schema" },
  { title: "3", value: "Mapping" },
  { title: "4", value: "Transfornm" },
  { title: "5", value: "Validate" },
  { title: "6", value: "Destination" },
  { title: "7", value: "Test" },
  { title: "8", value: "Publish" },
];

function CreateWorkflow({ onCancel }) {
  const [billcodeRowCount, setBillCodeRowCount] = useState(null);
  const [generatedCsvRowCount, setGeneratedCsvRowCount] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  //zustand
  const isCsvSelected = useCsvStore((state) => state.isCsvSelected);
  const setCsvSelected = useCsvStore((state) => state.csvSeleected);
  console.log(isCsvSelected);

  const handleBack = () => {
    console.log("Handle  back clicked");
    setStepCount((prev) => prev - 1);
  };

  const handleNext = () => {
    console.log("handle Next clicked");
    setStepCount((prev) => prev + 1);
  };

  console.log(stepCount);

  return (
    <div>
      <button className="text-gray-400 cursor-pointer" onClick={onCancel}>
        {" "}
        -back to workflows
      </button>

      <div className="mt-14 flex w-full items-center gap-0 bg-white p-10">
        {flowvalues.map((flow, index) => (
          <div key={flow.value} className="flex flex-1 items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {flow.title}
              </div>
              <span className="whitespace-nowrap text-sm font-medium text-slate-900">
                {flow.value}
              </span>
            </div>
            {index < flowvalues.length - 1 && (
              <div className="mx-6 flex-1 border border-t-2 border-dashed border-slate-400" />
            )}
          </div>
        ))}
      </div>
      {/*  Choose Data Source */}
      {/*  add condition based on the page number */}
      <div>
        <div className="mt-14  w-full items-center gap-0 bg-white p-10">
          {stepCount === 0 && (
            <>
              <span className="text-md font-bold text-slate-900">
                Choose Your Data Source
              </span>
              <UploadSetup
                resetTrigger={resetTrigger}
                setResetTrigger={setResetTrigger}
              ></UploadSetup>
            </>
          )}
          {stepCount === 1 && <SchemaFlow />}
          {stepCount === 2 && <TransformStage/>}
          <div className="flex justify-between mt-4">
            <button
              className="flex items-center justify-center  cursor-pointer gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="flex items-center justify-center  cursor-pointer gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkflow;
