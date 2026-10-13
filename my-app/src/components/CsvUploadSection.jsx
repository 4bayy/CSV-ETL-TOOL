import { useRef, useState } from "react";
import { CloudUpload, CheckCircle2, X, Info } from "lucide-react";

export default function CsvUploadSection() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (selectedFiles) => {
    const csvFiles = Array.from(selectedFiles).filter(
      (file) =>
        file.name.toLowerCase().endsWith(".csv") &&
        file.size <= 10 * 1024 * 1024,
    );

    setFiles((prev) => {
      const existing = new Set(prev.map((file) => file.name));
      return [...prev, ...csvFiles.filter((file) => !existing.has(file.name))];
    });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const removeFile = (fileName) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  return (
    <section className="w-full rounded-xl bg-white p-6">
      <h2 className="text-base font-bold text-slate-800">
        1. Upload CSV Files
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        You can upload multiple CSV files. They will be combined based on the
        transformation rules.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`mt-4 flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-5 transition ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30"
        }`}
      >
        <CloudUpload
          size={38}
          strokeWidth={1.8}
          className="mb-2 text-blue-500"
        />

        <p className="text-sm font-medium text-slate-700">
          Drag &amp; drop files here or{" "}
          <span className="text-blue-600">click to upload</span>
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Supports CSV (Max 10MB per file)
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2 rounded-xl border border-slate-100 p-1">
          {files.map((file) => (
            <div
              key={`${file.name}-${file.lastModified}`}
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-4 py-3"
            >
              <CheckCircle2
                size={20}
                className="shrink-0 fill-emerald-600 text-white"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">
                  {file.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatSize(file.size)}
                </p>
              </div>

              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.name);
                }}
                className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <X size={17} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Info size={15} className="shrink-0" />
        <span>
          {files.length} {files.length === 1 ? "file" : "files"} uploaded
        </span>
      </div>
    </section>
  );
}
