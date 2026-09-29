import {
  LayoutDashboard,
  FileSpreadsheet,
  Package,
  Settings,
  Upload,
  X,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "workflows",
    icon: Upload,
    path: "/workflow",
  },
  {
    label: "Run Workflow",
    icon: Package,
    path: "/run-workflow",
  },
  {
    label: "CSV Compare",
    icon: FileSpreadsheet,
    path: "/csv-compare",
  },
  {
    label: "History",
    icon: FileSpreadsheet,
    path: "/history",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              CSV Manager
            </h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.path}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              A
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Admin
              </p>
              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;