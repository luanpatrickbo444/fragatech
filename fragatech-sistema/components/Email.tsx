"use client";

import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import type { ToastType } from "./Toast";

interface Props {
  showToast: (msg: string, type: ToastType) => void;
}

export function Email({ showToast }: Props) {
  const [form, setForm] = useState({
    para: "fornecedor@empresa.com",
    assunto: "Confirmação de Pedido • PO-2026-014",
    mensagem: `Bom dia, Ana.

Confirmamos o recebimento da proposta e solicitamos a confirmação do prazo de entrega do pedido PO-2026-014.

Atenciosamente,
Luan • Compras • FragaTech`,
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.para.trim() || !form.assunto.trim() || !form.mensagem.trim()) {
      showToast("Preencha todos os campos.", "error");
      return;
    }
    showToast("E-mail simulado enviado com sucesso! (didático)", "success");
  };

  const checklist = [
    "Assunto específico, claro e com referência do pedido.",
    "Destinatários e cópias revisados (CC e CCO).",
    "Minimização de dados sensíveis e senhas.",
    "Verificação anti-phishing (remetente e anexos).",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          E-mail Corporativo & Comunicação
        </h2>
        <p className="text-slate-500 mt-1">
          Pratique a redação de e-mails profissionais com checklist de
          segurança.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Mail size={18} className="text-blue-600" />
            Novo E-mail de Processo
          </h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Para:
              </label>
              <input
                type="email"
                value={form.para}
                onChange={(e) => setForm({ ...form, para: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Assunto:
              </label>
              <input
                type="text"
                value={form.assunto}
                onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Mensagem:
              </label>
              <textarea
                rows={8}
                value={form.mensagem}
                onChange={(e) =>
                  setForm({ ...form, mensagem: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition text-sm"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            Checklist de Segurança
          </h3>
          <ul className="space-y-3">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 text-emerald-500 font-bold">✓</span>
                <span className="text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Dica SENAI:</strong> Sempre revise o e-mail antes de
              enviar. Dados sensíveis (senhas, dados bancários) nunca devem
              ser enviados por e-mail sem criptografia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
