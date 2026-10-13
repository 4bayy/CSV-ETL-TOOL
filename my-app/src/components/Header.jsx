import React from "react";
import {
  Workflow,
  LayoutDashboard,
  History,
  Settings,
  ChevronDown,
  Menu
} from "lucide-react";

function Header( { onMenuClick } ) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Workflow size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Flow<span className="text-blue-600">Forge</span>
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              CSV Workflow Studio
            </p>
          </div>
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <LayoutDashboard size={17} />
            Dashboard
          </a>

          <a
            href="/workflows"
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            <Workflow size={17} />
            Workflows
          </a>

          <a
            href="/history"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <History size={17} />
            History
          </a>
        </nav>

        {/* User profile */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Settings"
            className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
          >
            <Settings size={19} />
          </button>

          <div className="h-8 w-px bg-slate-200" />

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              U
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">User</p>
              <p className="text-xs text-slate-500">Free plan</p>
            </div>

            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
