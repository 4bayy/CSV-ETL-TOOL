import React, { useState } from "react";
import {
  Plus,
  ChevronDown,
  CheckCircle2,
  Trash2,
} from "lucide-react";

const initialFields = [
  {
    name: "employee_id",
    type: "String",
    required: true,
    sample: "EMP001",
  },
  {
    name: "first_name",
    type: "String",
    required: true,
    sample: "John",
  },
  {
    name: "last_name",
    type: "String",
    required: true,
    sample: "Smith",
  },
  {
    name: "hours",
    type: "Number",
    required: true,
    sample: "8",
  },
  {
    name: "rate",
    type: "Number",
    required: true,
    sample: "500",
  },
  {
    name: "email",
    type: "Email",
    required: false,
    sample: "john@example.com",
  },
  {
    name: "department",
    type: "String",
    required: false,
    sample: "Operations",
  },
  {
    name: "start_date",
    type: "Date",
    required: false,
    sample: "2023-04-12",
  },
];

const dataTypes = ["String", "Number", "Email", "Date", "Boolean"];

export default function SchemaFlow() {
  const [fields, setFields] = useState(initialFields);

  const updateField = (index, key, value) => {
    setFields((prev) =>
      prev.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      )
    );
  };

  const removeField = (index) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        name: `new_field_${prev.length + 1}`,
        type: "String",
        required: false,
        sample: "-",
      },
    ]);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-900">
            Detected schema
          </h2>

          <p className="mt-1 text-[15px] text-slate-500">
            We found {fields.length} columns in your file.
          </p>
        </div>

        <button
          type="button"
          onClick={addField}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
        >
          <Plus size={17} />
          Add field
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[1.25fr_150px_100px_1.25fr_70px_35px] items-center border-b border-slate-200 bg-white px-4 py-4 text-sm font-medium uppercase tracking-wide text-slate-500">
          <div>Column</div>
          <div>Data Type</div>
          <div>Required</div>
          <div>Sample Value</div>
          <div>Status</div>
          <div></div>
        </div>

        {/* Rows */}
        {fields.map((field, index) => (
          <div
            key={`${field.name}-${index}`}
            className="grid grid-cols-[1.25fr_150px_100px_1.25fr_70px_35px] items-center border-b border-slate-200 px-4 py-3 last:border-b-0"
          >
            {/* Column */}
            <div className="min-w-0">
              <span className="font-mono text-[13px] text-slate-900">
                {field.name}
              </span>
            </div>

            {/* Data Type */}
            <div>
              <div className="relative w-[123px]">
                <select
                  value={field.type}
                  onChange={(e) =>
                    updateField(index, "type", e.target.value)
                  }
                  className="h-12 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-8 text-[16px] text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {dataTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Required Toggle */}
            <div>
              <button
                type="button"
                onClick={() =>
                  updateField(index, "required", !field.required)
                }
                className={`relative h-6 w-10 rounded-full transition ${
                  field.required
                    ? "bg-blue-600"
                    : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition ${
                    field.required
                      ? "left-[18px]"
                      : "left-[1px]"
                  }`}
                />
              </button>
            </div>

            {/* Sample */}
            <div className="min-w-0">
              <span className="font-mono text-[14px] text-slate-500">
                {field.sample}
              </span>
            </div>

            {/* Status */}
            <div>
              <CheckCircle2
                size={19}
                strokeWidth={2}
                className="text-emerald-600"
              />
            </div>

            {/* Delete */}
            <div>
              <button
                type="button"
                onClick={() => removeField(index)}
                className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}