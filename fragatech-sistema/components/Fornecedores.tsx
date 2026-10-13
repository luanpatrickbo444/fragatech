"use client";

import { useState } from "react";
import { Truck, Plus, Trash2, PackageCheck, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, validarCnpjOuCpf, validarEmail, maskCnpjCpf } from "@/lib/utils";
import type { ToastType } from "./Toast";
import type { ItemPedido } from "@/lib/types";

interface Props { showToast: (msg: string, type: ToastType) => void; }

export function Fornecedores({ showToast }: Props) {
  const {
    fornecedores, produtos, ordensCompra,
    addFornecedor, removeFornecedor,
    criarOrdemCompra, receberOrdemCompra, cancelarOrdemCompra,
  } = useStore();

  const [form, setForm] = useState({ razaoSocial: "", cnpj: "", contato: "", email: "", telefone: "" });
  const [fornId, setFornId] = useState(fornecedores[0]?.id || "");
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [prodId, setProdId] = useState(produtos[0]?.id || "");
  const [qtd, setQtd] = useState(1);

  const handleAddForn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.razaoSocial.trim()) { showToast("Razão Social obrigatória.", "error"); return; }
    if (form.cnpj && !validarCnpjOuCpf(form.cnpj)) { showToast("CNPJ/CPF inválido.", "error"); return; }
    if (form.email && !validarEmail(form.email)) { showToast("E-mail inválido.", "error"); return; }
    addFornecedor(form);
    showToast("Fornecedor cadastrado!", "success");
    setForm({ razaoSocial: "", cnpj: "", contato: "", email: "", telefone: "" });
  };

  const addItem = () => {
    const p = produtos.find((x) => x.id === prodId);
    if (!p || qtd <= 0) return;
    const existing = itens.find((i) => i.produtoId === prodId);
    if (existing) {
      setItens(itens.map((i) => i.produtoId === prodId ? { ...i, quantidade: i.quantidade + qtd } : i));
    } else {
      setItens([...itens, { produtoId: prodId, quantidade: qtd, precoUnitario: p.custo }]);
    }
    setQtd(1);
  };

  const handleOC = () => {
    const r = criarOrdemCompra(fornId, itens);
    showToast(r.msg, r.ok ? "success" : "error");
    if (r.ok) setItens([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Fornecedores & Ordens de Compra</h2>
        <p className="text-slate-500 mt-1">Cadastre fornecedores e gere OCs. Ao receber, o estoque sobe automaticamente.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Cadastro fornecedor */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" /> Novo Fornecedor
          </h3>
          <form onSubmit={handleAddForn} className="space-y-3">
            <input placeholder="Razão Social" value={form.razaoSocial} onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input placeholder="CNPJ / CPF" value={form.cnpj}
              onChange={(e) => setForm({ ...form, cnpj: maskCnpjCpf(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input placeholder="Contato" value={form.contato} onChange={(e) => setForm({ ...form, contato: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input placeholder="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input placeholder="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm">Salvar Fornecedor</button>
          </form>
        </div>

        {/* Lista fornecedores */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Truck size={18} /> Fornecedores</h3>
          </div>
          {fornecedores.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">Nenhum fornecedor cadastrado.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {fornecedores.map((f) => (
                <div key={f.id} className="px-6 py-3 flex justify-between items-center hover:bg-slate-50/50">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{f.razaoSocial}</p>
                    <p className="text-xs text-slate-400">{f.cnpj} • {f.contato}</p>
                  </div>
                  <button onClick={() => { removeFornecedor(f.id); showToast("Fornecedor removido.", "success"); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ordem de compra */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Nova Ordem de Compra</h3>
          <select value={fornId} onChange={(e) => setFornId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm">
            {fornecedores.map((f) => <option key={f.id} value={f.id}>{f.razaoSocial}</option>)}
          </select>
          <div className="flex gap-2">
            <select value={prodId} onChange={(e) => setProdId(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm">
              {produtos.map((p) => <option key={p.id} value={p.id}>{p.codigo} – {p.descricao}</option>)}
            </select>
            <input type="number" min={1} value={qtd} onChange={(e) => setQtd(Number(e.target.value))} className="w-20 px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
            <button type="button" onClick={addItem} className="px-3 py-2.5 bg-slate-100 rounded-xl text-sm font-medium">+</button>
          </div>
          {itens.map((i) => {
            const p = produtos.find((x) => x.id === i.produtoId);
            return (
              <div key={i.produtoId} className="flex justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                <span>{p?.descricao} × {i.quantidade}</span>
                <button onClick={() => setItens(itens.filter((x) => x.produtoId !== i.produtoId))} className="text-red-500"><X size={14} /></button>
              </div>
            );
          })}
          <button onClick={handleOC} disabled={!itens.length}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-sm">
            Criar OC
          </button>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Ordens de Compra</h3>
          </div>
          {ordensCompra.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">Nenhuma ordem de compra.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">Número</th>
                    <th className="px-4 py-3 font-medium">Fornecedor</th>
                    <th className="px-4 py-3 font-medium">Valor</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ordensCompra.map((oc) => {
                    const f = fornecedores.find((x) => x.id === oc.fornecedorId);
                    return (
                      <tr key={oc.id}>
                        <td className="px-4 py-3 font-mono text-blue-600 font-medium">{oc.numero}</td>
                        <td className="px-4 py-3">{f?.razaoSocial}</td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(oc.valorTotal)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            oc.status === "ABERTA" ? "bg-amber-100 text-amber-700" :
                            oc.status === "RECEBIDA" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          }`}>{oc.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{formatDate(oc.data)}</td>
                        <td className="px-4 py-3">
                          {oc.status === "ABERTA" && (
                            <div className="flex gap-1">
                              <button onClick={() => { const r = receberOrdemCompra(oc.id); showToast(r.msg, r.ok ? "success" : "error"); }}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600" title="Receber (entrada estoque)">
                                <PackageCheck size={14} />
                              </button>
                              <button onClick={() => { cancelarOrdemCompra(oc.id); showToast("OC cancelada.", "success"); }}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600"><X size={14} /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
