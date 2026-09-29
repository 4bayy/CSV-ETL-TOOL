import {
  FileSpreadsheet,
  Package,
  CheckCircle,
  AlertCircle,
  Upload,
  ArrowUpRight,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Products",
    value: "1,248",
    icon: Package,
    description: "+12% this month",
  },
  {
    title: "CSV Imports",
    value: "86",
    icon: FileSpreadsheet,
    description: "+8 this month",
  },
  {
    title: "Successful Imports",
    value: "82",
    icon: CheckCircle,
    description: "95.3% success rate",
  },
  {
    title: "Failed Imports",
    value: "4",
    icon: AlertCircle,
    description: "Needs attention",
  },
];

const Dashboard = () => {
  const  navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your CSV imports and product data.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Icon size={20} className="text-slate-700" />
                </div>

                <ArrowUpRight size={18} className="text-slate-400" />
              </div>

              <p className="mt-4 text-sm text-slate-500">{stat.title}</p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs text-slate-500">{stat.description}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Import Product CSV
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload a CSV file to import products into the system.
            </p>
          </div>
     
            <button className="flex items-center justify-center  cursor-pointer gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            onClick={()=> navigate("/workflow")}
            >
              Run Workflow
            </button>

        </div>
      </div>
      {/* Recent Imports */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">Recent Imports</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            ["products-september.csv", "248 products", "Successful"],
            ["skincare-products.csv", "156 products", "Successful"],
            ["new-products.csv", "89 products", "Failed"],
          ].map(([file, products, status]) => (
            <div
              key={file}
              className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <FileSpreadsheet size={18} className="text-slate-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">{file}</p>

                  <p className="text-xs text-slate-500">{products}</p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  status === "Successful"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
