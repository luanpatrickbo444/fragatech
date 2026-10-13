"use client";

import { useState, useMemo } from "react";
import { BarChart3, Download, Filter } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, formatDateShort, exportCSV } from "@/lib/utils";

export function Relatorios() {
  const { produtos, clientes, movimentacoes, documentos, pedidos, faturamento } = useStore();
  const [filtroData, setFiltroData] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"TODOS" | "ENTRADA" | "SAIDA">("TODOS");

  const estoqueBaixo = produtos.filter((p) => p.saldo < p.minimo);

  const movsFiltradas = useMemo(() => {
    return movimentacoes.filter((m) => {
      if (filtroTipo !== "TODOS" && m.tipo !== filtroTipo) return false;
      if (filtroData) {
        const d = m.data.slice(0, 10);
        if (d !== filtroData) return false;
      }
      return true;
    });
  }, [movimentacoes, filtroData, filtroTipo]);

  const docsHoje = documentos.filter((d) => d.data.slice(0, 10) === new Date().toISOString().slice(0, 10));
  const fatHoje = docsHoje.reduce((a, d) => a + d.valorTotal, 0);

  const clientesPorCondicao = useMemo(() => {
    const map: Record<string, number> = {};
    clientes.forEach((c) => { map[c.condicao] = (map[c.condicao] || 0) + 1; });
    return Object.entries(map);
  }, [clientes]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Relatórios</h2>
        <p className="text-slate-500 mt-1">Indicadores, histórico filtrado e exportação CSV.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Faturamento Total", value: formatCurrency(faturamento) },
          { label: "Faturamento Hoje", value: formatCurrency(fatHoje) },
          { label: "Produtos em Reposição", value: String(estoqueBaixo.length), alert: estoqueBaixo.length > 0 },
          { label: "Pedidos Abertos", value: String(pedidos.filter((p) => p.status === "ABERTO").length) },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase">{c.label}</p>
            <p className={`text-2xl font-bold mt-2 ${c.alert ? "text-amber-600" : "text-slate-800"}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Estoque baixo */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Estoque Baixo (abaixo do mínimo)</h3>
          <button
            onClick={() => exportCSV("estoque-baixo.csv", estoqueBaixo.map((p) => ({
              Codigo: p.codigo, Produto: p.descricao, Saldo: p.saldo, Minimo: p.minimo, Custo: p.custo, Preco: p.preco,
            })))}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Download size={14} /> CSV
          </button>
        </div>
        {estoqueBaixo.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">Nenhum produto abaixo do mínimo. 👍</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium">Saldo</th>
              <th className="px-4 py-3 font-medium">Mínimo</th>
              <th className="px-4 py-3 font-medium">Falta</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {estoqueBaixo.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-mono text-blue-600">{p.codigo}</td>
                  <td className="px-4 py-3 font-medium">{p.descricao}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">{p.saldo}</td>
                  <td className="px-4 py-3">{p.minimo}</td>
                  <td className="px-4 py-3 text-amber-600 font-medium">{p.minimo - p.saldo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Clientes por condição */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800">Clientes por Condição de Pagamento</h3>
          <button
            onClick={() => exportCSV("clientes.csv", clientes.map((c) => ({
              RazaoSocial: c.razaoSocial, CNPJ: c.cnpj, Contato: c.contato, Email: c.email, Condicao: c.condicao,
            })))}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Download size={14} /> Exportar clientes
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {clientesPorCondicao.map(([cond, qtd]) => (
            <div key={cond} className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{qtd}</p>
              <p className="text-xs text-slate-500 mt-1">{cond}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico movimentações */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Filter size={16} /> Histórico de Movimentações
          </h3>
          <div className="flex flex-wrap gap-2">
            <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm" />
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm">
              <option value="TODOS">Todos</option>
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
            <button
              onClick={() => exportCSV("movimentacoes.csv", movsFiltradas.map((m) => {
                const p = produtos.find((x) => x.id === m.produtoId);
                return { Data: formatDate(m.data), Tipo: m.tipo, Produto: p?.descricao || "", Codigo: p?.codigo || "", Qtd: m.quantidade, Obs: m.observacao || "" };
              }))}
              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium px-2"
            >
              <Download size={14} /> CSV
            </button>
          </div>
        </div>
        {movsFiltradas.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">Nenhuma movimentação encontrada com esses filtros.</div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0">
                <tr className="bg-slate-50 text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Qtd</th>
                  <th className="px-4 py-3 font-medium">Obs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {movsFiltradas.map((m) => {
                  const p = produtos.find((x) => x.id === m.produtoId);
                  return (
                    <tr key={m.id}>
                      <td className="px-4 py-2.5 text-xs text-slate-500">{formatDate(m.data)}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${m.tipo === "ENTRADA" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                          {m.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">{p?.codigo} – {p?.descricao}</td>
                      <td className="px-4 py-2.5 font-medium">{m.quantidade}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-400">{m.observacao || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Docs fiscais export */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><BarChart3 size={18} /> Documentos Fiscais</h3>
          <p className="text-sm text-slate-500 mt-1">{documentos.length} documento(s) emitido(s)</p>
        </div>
        <button
          onClick={() => exportCSV("documentos-fiscais.csv", documentos.map((d) => {
            const c = clientes.find((x) => x.id === d.clienteId);
            const p = produtos.find((x) => x.id === d.produtoId);
            return { Numero: d.numero, Tipo: d.tipo, Cliente: c?.razaoSocial || "", Produto: p?.descricao || "", Qtd: d.quantidade, Valor: d.valorTotal, Data: formatDateShort(d.data) };
          }))}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Download size={16} /> Exportar NF-es (CSV)
        </button>
      </div>
    </div>
  );
}
