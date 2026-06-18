import { NavLink } from "react-router-dom";
import { Flame, FileCheck, ClipboardList, Plane, Bell, User } from "lucide-react";
import { cn } from "@/utils/helpers";

const navItems = [
  { to: "/", label: "故障热力", icon: Flame },
  { to: "/case-quality", label: "案例质量", icon: FileCheck },
  { to: "/review-list", label: "复盘清单", icon: ClipboardList },
];

export function Header() {
  return (
    <header className="bg-industrial-surface/80 backdrop-blur-sm border-b border-industrial-border sticky top-0 z-30">
      <div className="flex items-center h-16 px-6 gap-8">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <Plane size={20} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-industrial-text font-mono tracking-tight">
              TLI · 航线排故知识库
            </h1>
            <p className="text-[11px] text-industrial-subtle leading-none">
              Troubleshooting Knowledge Intelligence
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 ml-6">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-500/15 text-primary-400 shadow-glow"
                    : "text-industrial-subtle hover:text-industrial-text hover:bg-industrial-hover",
                )
              }
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-md text-industrial-subtle hover:text-industrial-text hover:bg-industrial-hover transition-colors relative">
            <Bell size={18} strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-danger rounded-full" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-industrial-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-medium">
              <User size={16} strokeWidth={1.8} />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-industrial-text leading-none">质控管理员</p>
              <p className="text-xs text-industrial-subtle mt-0.5">质量部门</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
