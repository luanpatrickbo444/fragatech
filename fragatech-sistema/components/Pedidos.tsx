"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Check, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ToastType } from "./Toast";
import type { ItemPedido } from "@/lib/types";

interface Props { showToast: (msg: string, type: ToastType) => void; }

export function Pedidos({ showToast }: Props) {
  const { clientes, produtos, pedidos, criarPedido, faturarPedido, cancelarPedido } = useStore();
  const [clienteId, setClienteId] = useState(clientes[0]?.id || "");
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [prodId, setProdId] = useState(produtos[0]?.id || "");
  const [qtd, setQtd] = useState(1);

  const addItem = () => {
    const p = produtos.find((x) => x.id === prodId);
    if (!p || qtd <= 0) return;
    const existing = itens.find((i) => i.produtoId === prodId);
    if (existing) {
      setItens(itens.map((i) => i.produtoId === prodId ? { ...i, quantidade: i.quantidade + qtd } : i));
    } else {
      setItens([...itens, { produtoId: prodId, quantidade: qtd, precoUnitario: p.preco }]);
    }
    setQtd(1);
  };

  const removeItem = (id: string) => setItens(itens.filter((i) => i.produtoId !== id));

  const total = itens.reduce((a, i) => a + i.quantidade * i.precoUnitario, 0);

  const handleCriar = () => {
    const r = criarPedido(clienteId, itens);
    showToast(r.msg, r.ok ? "success" : "error");
    if (r.ok) setItens([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Pedidos de Venda</h2>
        <p className="text-slate-500 mt-1">Cliente pede → gera pedido → fatura (baixa estoque + NF-e).</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" /> Novo Pedido
          </h3>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Cliente</label>
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.razaoSocial}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <select value={prodId} onChange={(e) => setProdId(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm">
              {produtos.map((p) => <option key={p.id} value={p.id}>{p.codigo} – {p.descricao} (saldo {p.saldo})</option>)}
            </select>
            <input type="number" min={1} value={qtd} onChange={(e) => setQtd(Number(e.target.value))}
              className="w-20 px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
            <button type="button" onClick={addItem} className="px-3 py-2.5 bg-slate-100 rounded-xl text-sm font-medium hover:bg-slate-200">+</button>
          </div>
          {itens.length > 0 && (
            <div className="space-y-2">
              {itens.map((i) => {
                const p = produtos.find((x) => x.id === i.produtoId);
                return (
                  <div key={i.produtoId} className="flex justify-between items-center text-sm bg-slate-50 rounded-lg px-3 py-2">
                    <span>{p?.descricao} × {i.quantidade}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatCurrency(i.quantidade * i.precoUnitario)}</span>
                      <button onClick={() => removeItem(i.produtoId)} className="text-red-500"><X size={14} /></button>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-100">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}
          <button onClick={handleCriar} disabled={!itens.length}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-sm transition">
            Criar Pedido
          </button>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <ShoppingCart size={18} /> Pedidos Registrados
            </h3>
          </div>
          {pedidos.length === 0 ? (
            <div className="px-6 py-16 text-center text-slate-400">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum pedido ainda. Crie o primeiro ao lado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">Número</th>
                    <th className="px-4 py-3 font-medium">Cliente</th>
                    <th className="px-4 py-3 font-medium">Itens</th>
                    <th className="px-4 py-3 font-medium">Valor</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pedidos.map((ped) => {
                    const cli = clientes.find((c) => c.id === ped.clienteId);
                    return (
                      <tr key={ped.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-blue-600 font-medium">{ped.numero}</td>
                        <td className="px-4 py-3">{cli?.razaoSocial}</td>
                        <td className="px-4 py-3 text-slate-600">{ped.itens.length}</td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(ped.valorTotal)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            ped.status === "ABERTO" ? "bg-amber-100 text-amber-700" :
                            ped.status === "FATURADO" ? "bg-emerald-100 text-emerald-700" :
                            "bg-slate-100 text-slate-500"
                          }`}>{ped.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{formatDate(ped.data)}</td>
                        <td className="px-4 py-3">
                          {ped.status === "ABERTO" && (
                            <div className="flex gap-1">
                              <button onClick={() => { const r = faturarPedido(ped.id); showToast(r.msg, r.ok ? "success" : "error"); }}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100" title="Faturar">
                                <Check size={14} />
                              </button>
                              <button onClick={() => { cancelarPedido(ped.id); showToast("Pedido cancelado.", "success"); }}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Cancelar">
                                <X size={14} />
                              </button>
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
