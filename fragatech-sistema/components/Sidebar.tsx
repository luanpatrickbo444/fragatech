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
  LogOut,
  User,
} from "lucide-react";
import type { Page } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

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
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);

  return (
    <>
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

          {/* Usuário logado */}
          {user && (
            <div className="mx-4 mt-4 p-3 bg-slate-800/60 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <User size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {user.nome.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    RA {user.ra} • {user.turma}
                  </p>
                </div>
              </div>
            </div>
          )}

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

        <div className="p-4 space-y-2 border-t border-slate-800">
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition"
          >
            <LogOut size={16} />
            Sair
          </button>
          <p className="text-[10px] text-slate-600 text-center">
            SENAI • Gestão Operacional v2.1
          </p>
        </div>
      </aside>
    </>
  );
}

export function MobileHeader({ onMenu }: { onMenu: () => void }) {
  const user = useStore((s) => s.user);
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
      <button
        onClick={onMenu}
        className="p-2 rounded-lg hover:bg-slate-100"
      >
        <Menu size={22} />
      </button>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="p-1.5 bg-blue-600 rounded-md text-white font-bold text-sm">
          FT
        </div>
        <div className="min-w-0">
          <span className="font-semibold text-slate-800 text-sm block truncate">
            FragaTech
          </span>
          {user && (
            <span className="text-[10px] text-slate-400 truncate block">
              {user.nome.split(" ").slice(0, 2).join(" ")}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
