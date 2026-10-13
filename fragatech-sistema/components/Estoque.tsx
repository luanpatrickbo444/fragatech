"use client";

import { useState } from "react";
import { Plus, Package, ArrowDownUp, Search, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { ToastType } from "./Toast";

interface Props {
  showToast: (msg: string, type: ToastType) => void;
}

const CATEGORIAS = ["Informática", "Periféricos", "Acessórios", "Serviços"];

export function Estoque({ showToast }: Props) {
  const {
    produtos,
    movimentacoes,
    addProduto,
    removeProduto,
    movimentar,
  } = useStore();

  const [form, setForm] = useState({
    codigo: "",
    descricao: "",
    categoria: "Informática",
    unidade: "UN",
    custo: 0,
    preco: 0,
    saldo: 0,
    minimo: 5,
  });

  const [mov, setMov] = useState({
    produtoId: produtos[0]?.id || "",
    tipo: "ENTRADA" as "ENTRADA" | "SAIDA",
    quantidade: 1,
  });

  const [search, setSearch] = useState("");

  const filtered = produtos.filter(
    (p) =>
      p.descricao.toLowerCase().includes(search.toLowerCase()) ||
      p.codigo.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.codigo.trim() || !form.descricao.trim()) {
      showToast("Código e Descrição são obrigatórios.", "error");
      return;
    }
    if (produtos.some((p) => p.codigo === form.codigo)) {
      showToast("Já existe um produto com este código.", "error");
      return;
    }
    addProduto(form);
    showToast("Produto cadastrado com sucesso!", "success");
    setForm({
      codigo: "",
      descricao: "",
      categoria: "Informática",
      unidade: "UN",
      custo: 0,
      preco: 0,
      saldo: 0,
      minimo: 5,
    });
  };

  const handleMov = (e: React.FormEvent) => {
    e.preventDefault();
    const result = movimentar(mov.produtoId, mov.tipo, mov.quantidade);
    showToast(result.msg, result.ok ? "success" : "error");
    if (result.ok) setMov({ ...mov, quantidade: 1 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Gestão de Estoque & Cadastro de Produtos
        </h2>
        <p className="text-slate-500 mt-1">
          Cadastre produtos e registre entradas/saídas de estoque.
        </p>
      </div>

      {/* Cadastro */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Package size={18} className="text-blue-600" />
          Cadastrar Novo Produto
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            placeholder="Código (Ex: P005)"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Descrição do Produto"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            placeholder="Unidade (UN, CX, PC)"
            value={form.unidade}
            onChange={(e) => setForm({ ...form, unidade: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Custo Unitário (R$)"
            value={form.custo || ""}
            onChange={(e) => setForm({ ...form, custo: Number(e.target.value) })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Preço Venda (R$)"
            value={form.preco || ""}
            onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Estoque Inicial"
            value={form.saldo || ""}
            onChange={(e) => setForm({ ...form, saldo: Number(e.target.value) })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Estoque Mínimo"
            value={form.minimo || ""}
            onChange={(e) => setForm({ ...form, minimo: Number(e.target.value) })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Salvar e Cadastrar Produto
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Movimentação */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ArrowDownUp size={18} className="text-blue-600" />
            Registrar Movimentação
          </h3>
          <form onSubmit={handleMov} className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMov({ ...mov, tipo: "ENTRADA" })}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
                  mov.tipo === "ENTRADA"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                + ENTRADA
              </button>
              <button
                type="button"
                onClick={() => setMov({ ...mov, tipo: "SAIDA" })}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
                  mov.tipo === "SAIDA"
                    ? "bg-red-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                − SAÍDA
              </button>
            </div>
            <select
              value={mov.produtoId}
              onChange={(e) => setMov({ ...mov, produtoId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.codigo} – {p.descricao}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={mov.quantidade}
              onChange={(e) =>
                setMov({ ...mov, quantidade: Number(e.target.value) })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition text-sm"
            >
              Confirmar Movimento
            </button>
          </form>

          {/* Histórico recente */}
          {movimentacoes.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                Últimas movimentações
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {movimentacoes.slice(0, 8).map((m) => {
                  const prod = produtos.find((p) => p.id === m.produtoId);
                  return (
                    <div
                      key={m.id}
                      className="text-xs flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2"
                    >
                      <span>
                        <span
                          className={
                            m.tipo === "ENTRADA"
                              ? "text-emerald-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {m.tipo === "ENTRADA" ? "+" : "−"}
                          {m.quantidade}
                        </span>{" "}
                        {prod?.codigo}
                      </span>
                      <span className="text-slate-400">
                        {new Date(m.data).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Planilha */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-800">
              Planilha e Saldos Cadastrados
            </h3>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">Cód</th>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Unid.</th>
                  <th className="px-4 py-3 font-medium">Saldo</th>
                  <th className="px-4 py-3 font-medium">Custo</th>
                  <th className="px-4 py-3 font-medium">Preço</th>
                  <th className="px-4 py-3 font-medium">Mínimo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => {
                  const critical = p.saldo < p.minimo;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono text-blue-600 font-medium">
                        {p.codigo}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {p.descricao}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.unidade}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {p.saldo}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatCurrency(p.custo)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatCurrency(p.preco)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.minimo}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            critical
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {critical ? "COMPRAR" : "OK"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            if (confirm(`Excluir ${p.descricao}?`)) {
                              removeProduto(p.id);
                              showToast("Produto removido.", "success");
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
