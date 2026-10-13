"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white animate-in slide-in-from-bottom-5 ${
        type === "success" ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={20} />
      ) : (
        <XCircle size={20} />
      )}
      <span className="text-sm font-medium max-w-xs">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-70 hover:opacity-100 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}
