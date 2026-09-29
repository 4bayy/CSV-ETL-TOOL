import { useEffect, useState } from "react";
import useCsvStore from "../store/store";

export default function FileUpload({ inputRef, resetTrigger }) {
  const files = useCsvStore((state) => state.files);
  const setCsvFile = useCsvStore((state) => state.addCsv);

  // Handle - File- Change
  const handleChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 0) {
      setCsvFile(selectedFiles);
    }

    // Allow selecting the same file again
    event.target.value = "";
  };

  console.log(" Uploaded Files ", files);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // useEffect(() => {
  //   setFile([]);
  //   if (inputRef.current) {
  //     inputRef.current.value = "";
  //   }
  // }, [resetTrigger, inputRef]);

  return (
    <div className="w-full max-w-md mt-3">
      <div className="text-left">
        <span className="mb-4 block text-md font-bold">
          Upload Your CSV Files
        </span>
        <p className="mt-4 text-sm text-gray-400">
          Upload One CSV File To Process
        </p>
      </div>

      {/* Upload Box */}
      <button
        className="border-2 border-dashed border-gray-300 mt-4 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Simple Icon (no external lib) */}
        {/* <div className="text-4xl mb-2">📁</div> */}

        <p className="text-gray-600">Drag & drop your CSV file here</p>
        <p className="text-sm text-gray-400">or click to browse</p>

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />
      </button>

      {files.length > 0 && (
        <>
          <div className="mt-4  p-4 bg-gray-100 rounded-lg flex justify-between items-center">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`}>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCsvFile((prev) =>
                      prev.filter((_, fileindex) => fileindex !== index),
                    );
                  }}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
