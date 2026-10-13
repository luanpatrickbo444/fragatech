"use client";

import { useState } from "react";
import { FileText, Receipt } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ToastType } from "./Toast";

interface Props {
  showToast: (msg: string, type: ToastType) => void;
}

const TIPOS = [
  "NF-e (Circulação de Mercadorias)",
  "NFS-e (Prestação de Serviços)",
  "CT-e (Transporte de Cargas)",
  "MDF-e (Manifesto Eletrônico)",
];

export function Fiscal({ showToast }: Props) {
  const { clientes, produtos, documentos, emitirDocumento } = useStore();
  const [form, setForm] = useState({
    tipo: TIPOS[0],
    clienteId: clientes[0]?.id || "",
    produtoId: produtos[0]?.id || "",
    quantidade: 1,
  });
  const [lastDoc, setLastDoc] = useState<string | null>(null);

  const handleEmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = emitirDocumento(form);
    showToast(result.msg, result.ok ? "success" : "error");
    if (result.ok && result.doc) {
      setLastDoc(result.doc.id);
    }
  };

  const doc = documentos.find((d) => d.id === lastDoc);
  const prod = doc ? produtos.find((p) => p.id === doc.produtoId) : null;
  const cli = doc ? clientes.find((c) => c.id === doc.clienteId) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Emissor & Simulação Fiscal
        </h2>
        <p className="text-slate-500 mt-1">
          Simule a emissão de documentos fiscais. A emissão baixa estoque e
          atualiza o faturamento automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-indigo-600" />
            Simular Emissão de Documento
          </h3>
          <form onSubmit={handleEmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Tipo de Documento Fiscal
              </label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {TIPOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Destinatário / Cliente
              </label>
              <select
                value={form.clienteId}
                onChange={(e) =>
                  setForm({ ...form, clienteId: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.razaoSocial}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Item/Produto
                </label>
                <select
                  value={form.produtoId}
                  onChange={(e) =>
                    setForm({ ...form, produtoId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.descricao} (Saldo: {p.saldo})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Quantidade
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.quantidade}
                  onChange={(e) =>
                    setForm({ ...form, quantidade: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition text-sm"
            >
              Emitir Documento Simulado
            </button>
          </form>
        </div>

        {/* DANFE preview */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Receipt size={18} className="text-indigo-600" />
            Resultado / Visualização DANFE
          </h3>

          {!doc ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Receipt size={48} className="mb-3 opacity-30" />
              <p className="text-sm text-center">
                Preencha os dados ao lado para gerar uma NF-e/NFS-e/CT-e
                simulada.
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">
                    Documento Fiscal Simulado
                  </p>
                  <p className="text-lg font-bold text-slate-800 mt-1">
                    {doc.numero}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                  {doc.tipo.split(" ")[0]}
                </span>
              </div>
              <hr className="border-slate-100" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400">Destinatário</p>
                  <p className="font-medium text-slate-800">
                    {cli?.razaoSocial}
                  </p>
                  <p className="text-xs text-slate-500">{cli?.cnpj}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Data de Emissão</p>
                  <p className="font-medium text-slate-800">
                    {formatDate(doc.data)}
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Item</p>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-800">
                    {prod?.descricao} × {doc.quantidade}
                  </span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(doc.valorTotal)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">
                  Valor Total do Documento
                </span>
                <span className="text-xl font-bold text-indigo-600">
                  {formatCurrency(doc.valorTotal)}
                </span>
              </div>
              <p className="text-xs text-center text-slate-400 pt-2">
                ⚠ Documento simulado para fins didáticos — não possui validade
                fiscal.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Histórico */}
      {documentos.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">
              Histórico de Documentos Emitidos
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500">
                  <th className="px-6 py-3 font-medium">Número</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Qtd</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {documentos.map((d) => {
                  const p = produtos.find((x) => x.id === d.produtoId);
                  const c = clientes.find((x) => x.id === d.clienteId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-mono font-medium text-indigo-600">
                        {d.numero}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {d.tipo.split(" ")[0]}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {c?.razaoSocial}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {p?.descricao}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {d.quantidade}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {formatCurrency(d.valorTotal)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {formatDate(d.data)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
