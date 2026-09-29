import React, { useRef } from "react";
import {
  FileSpreadsheet,
  FileText,
  Database,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import useCsvStore from "../store/store";
import FileUpload from "./FileUpload";

export const sources = [
  {
    title: "CSV",
    description: "Upload CSV files",
    icon: FileText,
    available: true,
  },
  {
    title: "Excel",
    description: "Upload Excel files",
    icon: FileSpreadsheet,
    available: true,
  },
  {
    title: "REST API",
    description: "Connect external APIs",
    icon: Globe,
    available: false,
  },
  {
    title: "Database",
    description: "Connect your database",
    icon: Database,
    available: false,
  },
];

function UploadSetup(resetTrigger ) {
  const setCsvSelected = useCsvStore((state) => state.setCsvSelected);
  const isCsvSelected = useCsvStore((state) => state.isCsvSelected);
  const inputRef = useRef(null);



  return (
    <div>
        <div className=" mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {sources.map((source) => {
            const Icon = source.icon;
            return (
              <div
                onClick={() => setCsvSelected(true)}
                key={source.title}
                className={`group rounded-2xl border bg-white p-6 transition-all ${
                  source.available
                    ? "cursor-pointer border-slate-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                    : "border-slate-100 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      source.available
                        ? "bg-slate-100 text-slate-700"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                  {/* Status
                  {source.available ? (
                    <ArrowUpRight
                      size={20}
                      className="text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                      Coming Soon
                    </span>
                  )} */}
                </div>

                {/* Content */}
                <div className="mt-5">
                  <h3 className="text-base font-semibold text-slate-900">
                    {source.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {source.description}
                  </p>
                </div>

                {/* Action */}
                {source.available && (
                  <div className="mt-5 text-sm font-medium text-slate-700">
                    Select source →
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div>
          {isCsvSelected && (
            <FileUpload
              inputRef={inputRef}
              resetTrigger={resetTrigger}
            />
          )}
          {/* {csvFile.length > 0 && (
            <div className="mt-4">
              <span className="font-medium">Selected Files</span>
              <div className="mt-2 space-y-2"></div>
              {csvFile.map((file , index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-md border bg-white p-3"
                >
                  <span className="truncate">{file.name}</span>

                  <button
                    type="button"
                    onClick={() => {
                      setBillCodeFiles((prev) =>
                        prev.filter((_, i) => i !== index),
                      );
                    }}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )} */}
        </div>
        
      </div>
  );
}

export default UploadSetup;
