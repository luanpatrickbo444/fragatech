"use client";

import { useState, useEffect } from "react";
import { Sidebar, MobileHeader } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { Clientes } from "@/components/Clientes";
import { Estoque } from "@/components/Estoque";
import { Pedidos } from "@/components/Pedidos";
import { Fornecedores } from "@/components/Fornecedores";
import { Fiscal } from "@/components/Fiscal";
import { Relatorios } from "@/components/Relatorios";
import { Email } from "@/components/Email";
import { ModoDidatico } from "@/components/ModoDidatico";
import { Professor } from "@/components/Professor";
import { Login } from "@/components/Login";
import { Toast, type ToastType } from "@/components/Toast";
import type { Page } from "@/lib/types";
import { useStore, isProfessor } from "@/lib/store";

export default function Home() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const user = useStore((s) => s.user);
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  const showToast = (message: string, type: ToastType) => setToast({ message, type });

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Login />;

  // Professor landing on professor panel
  const safePage = page === "professor" && !isProfessor(user) ? "dashboard" : page;

  const renderPage = () => {
    switch (safePage) {
      case "dashboard": return <Dashboard />;
      case "clientes": return <Clientes showToast={showToast} />;
      case "estoque": return <Estoque showToast={showToast} />;
      case "pedidos": return <Pedidos showToast={showToast} />;
      case "fornecedores": return <Fornecedores showToast={showToast} />;
      case "fiscal": return <Fiscal showToast={showToast} />;
      case "relatorios": return <Relatorios />;
      case "email": return <Email showToast={showToast} />;
      case "didatico": return <ModoDidatico onNavigate={setPage} showToast={showToast} />;
      case "professor": return <Professor showToast={showToast} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar current={safePage} onNavigate={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{renderPage()}</main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
