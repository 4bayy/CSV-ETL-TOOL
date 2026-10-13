import { useState } from "react";
import {
  Play,
  Download,
  CheckCircle2,
  LoaderCircle,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";

export default function ExecuteDownloadSection() {
  const [status, setStatus] = useState("idle");
  const [outputFile, setOutputFile] = useState(null);
  const [error, setError] = useState("");

  const executeWorkflow = async () => {
    setStatus("running");
    setError("");
    setOutputFile(null);

    try {
      // Replace this demo with your actual ETL API call.
      // Example:
      // const response = await fetch("/api/workflows/execute", {
      //   method: "POST",
      //   body: formData,
      // });
      // if (!response.ok) throw new Error("Execution failed");
      // const blob = await response.blob();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo output only. Replace with the actual transformed CSV.
      const blob = new Blob(["name,amount\nExample,100\n"], {
        type: "text/csv;charset=utf-8;",
      });

      setOutputFile(blob);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const downloadOutput = () => {
    if (!outputFile) return;

    const url = URL.createObjectURL(outputFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transformed_data.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-base font-bold text-slate-800">
          4. Execute & Download
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Run your ETL workflow and download the transformed CSV file.
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <FileSpreadsheet size={21} />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">
              Ready to process
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Your uploaded files and transformation rules will be processed
              into a single output file.
            </p>
          </div>
        </div>

        {status === "running" && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-blue-700">
                Executing workflow...
              </span>
              <LoaderCircle size={15} className="animate-spin text-blue-600" />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            Workflow executed successfully. Your output is ready.
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={executeWorkflow}
          disabled={status === "running"}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "running" ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Play size={17} />
          )}
          {status === "running" ? "Executing..." : "Execute Workflow"}
        </button>

        <button
          type="button"
          onClick={downloadOutput}
          disabled={status !== "success" || !outputFile}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={17} />
          Download CSV
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        Output format: CSV · UTF-8
      </p>
    </section>
  );
}
