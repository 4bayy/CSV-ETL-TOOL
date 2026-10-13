import {
  LayoutDashboard,
  FileSpreadsheet,
  Package,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Workflows", icon: Upload, path: "/workflow" },
  { label: "Run Workflow", icon: Package, path: "/run-workflow" },
  { label: "CSV Compare", icon: FileSpreadsheet, path: "/csv-compare" },
  { label: "History", icon: FileSpreadsheet, path: "/history" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar heading */}
        <div className="flex h-14 items-center justify-between border-b border-slate-100 px-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </span>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 p-4">
          <p className="text-xs text-slate-400">CSV Workflow Studio</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
