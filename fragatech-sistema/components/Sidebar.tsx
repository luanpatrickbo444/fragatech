"use client";

import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Mail,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import type { Page } from "@/lib/types";
import { cn } from "@/lib/utils";

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "estoque", label: "Estoque & Produtos", icon: Package },
  { id: "fiscal", label: "Fiscal & Faturamento", icon: FileText },
  { id: "email", label: "E-mail Corporativo", icon: Mail },
  { id: "didatico", label: "Modo Didático (SENAI)", icon: GraduationCap },
];

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function Sidebar({ current, onNavigate, open, setOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg font-bold text-xl">
                FT
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none">FragaTech</h1>
                <span className="text-xs text-slate-400">
                  Laboratório SENAI
                </span>
              </div>
            </div>
            <button
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          SENAI • Gestão Operacional v2.0
        </div>
      </aside>
    </>
  );
}

export function MobileHeader({
  onMenu,
}: {
  onMenu: () => void;
}) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
      <button
        onClick={onMenu}
        className="p-2 rounded-lg hover:bg-slate-100"
      >
        <Menu size={22} />
      </button>
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-600 rounded-md text-white font-bold text-sm">
          FT
        </div>
        <span className="font-semibold text-slate-800">FragaTech</span>
      </div>
    </header>
  );
}
