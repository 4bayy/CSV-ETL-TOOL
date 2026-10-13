import React, { useState } from "react";
import useCsvStore from "../store/store";
import TransformStage from "./TransformationPage";
import CsvUploadSection from "./CsvUploadSection";
import ExecuteDownloadSection from "./ExecuteDownloadSection";

export const flowvalues = [
  { title: "1", value: "Upload Files" },
  { title: "2", value: "Transform" },
  { title: "3", value: "Review & Execute" },
];

function CreateWorkflow({ onCancel }) {
  const [stepCount, setStepCount] = useState(0);

  // Zustand store
  const isCsvSelected = useCsvStore((state) => state.isCsvSelected);

  const handleBack = () => {
    setStepCount((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStepCount((prev) => Math.min(flowvalues.length - 1, prev + 1));
  };

  const currentStep = flowvalues[stepCount];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">
      {/* Back to workflows */}
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <span aria-hidden="true">←</span>
        Back to workflows
      </button>

      {/* Workflow header and stepper */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create ETL Workflow
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Upload your data, configure transformations, and export your
            results.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex w-full items-start">
          {flowvalues.map((flow, index) => {
            const isActive = index === stepCount;
            const isCompleted = index < stepCount;

            return (
              <React.Fragment key={flow.value}>
                <div className="flex min-w-0 flex-col items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold transition-colors sm:h-14 sm:w-14 ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white"
                        : isCompleted
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {isCompleted ? "✓" : flow.title}
                  </div>

                  <span
                    className={`max-w-28 text-center text-xs font-semibold sm:max-w-none sm:text-sm ${
                      isActive || isCompleted
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {flow.value}
                  </span>
                </div>

                {index < flowvalues.length - 1 && (
                  <div
                    className={`mx-2 mt-6 h-0 flex-1 border-t-2 border-dashed sm:mx-6 sm:mt-7 ${
                      index < stepCount
                        ? "border-emerald-400"
                        : "border-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Step content */}
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <div className="mb-6 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Step {stepCount + 1} of {flowvalues.length}
          </p>

          <h2 className="text-lg font-bold text-slate-900">
            {stepCount === 0 && "Choose Your Data Source"}
            {stepCount === 1 && "Configure Transformations"}
            {stepCount === 2 && "Review & Execute"}
          </h2>

          <p className="text-sm text-slate-500">
            {stepCount === 0 &&
              "Upload one or more CSV files to start your workflow."}
            {stepCount === 1 &&
              "Define how your source data should be transformed."}
            {stepCount === 2 &&
              "Execute your workflow and download the output CSV."}
          </p>
        </div>

        <div className="min-w-0">
          {stepCount === 0 && <CsvUploadSection />}
          {stepCount === 1 && <TransformStage />}
          {stepCount === 2 && <ExecuteDownloadSection />}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepCount === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Back
          </button>

          {stepCount < flowvalues.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Continue
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Finish
              <span aria-hidden="true">✓</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default CreateWorkflow;
