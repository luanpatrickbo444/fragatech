"use client";

import { useState, useEffect } from "react";
import { Sidebar, MobileHeader } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { Clientes } from "@/components/Clientes";
import { Estoque } from "@/components/Estoque";
import { Fiscal } from "@/components/Fiscal";
import { Email } from "@/components/Email";
import { ModoDidatico } from "@/components/ModoDidatico";
import { Login } from "@/components/Login";
import { Toast, type ToastType } from "@/components/Toast";
import type { Page } from "@/lib/types";
import { useStore } from "@/lib/store";

export default function Home() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Evita flash de login antes do zustand rehidratar
  useEffect(() => {
    setHydrated(true);
  }, []);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "clientes":
        return <Clientes showToast={showToast} />;
      case "estoque":
        return <Estoque showToast={showToast} />;
      case "fiscal":
        return <Fiscal showToast={showToast} />;
      case "email":
        return <Email showToast={showToast} />;
      case "didatico":
        return <ModoDidatico onNavigate={setPage} showToast={showToast} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        current={page}
        onNavigate={setPage}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader onMenu={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
