"use client";

import { Package, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export function Dashboard() {
  const { produtos, clientes, faturamento } = useStore();

  const valorEstoque = produtos.reduce(
    (acc, p) => acc + p.saldo * p.custo,
    0
  );
  const emReposicao = produtos.filter((p) => p.saldo < p.minimo);
  const ativos = clientes.length;

  const cards = [
    {
      label: "Valor em Estoque",
      value: formatCurrency(valorEstoque),
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Clientes Cadastrados",
      value: `${ativos} Ativos`,
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Atenção de Reposição",
      value: `${emReposicao.length} Produto(s)`,
      icon: AlertTriangle,
      color:
        emReposicao.length > 0
          ? "bg-amber-50 text-amber-600"
          : "bg-slate-50 text-slate-500",
      highlight: emReposicao.length > 0,
    },
    {
      label: "Faturamento Simulado",
      value: formatCurrency(faturamento),
      icon: TrendingUp,
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Visão Geral da Operação
        </h2>
        <p className="text-slate-500 mt-1">
          Acompanhe os principais indicadores da FragaTech Distribuidora.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {card.label}
                </p>
                <p
                  className={`text-2xl font-bold mt-2 ${
                    card.highlight ? "text-amber-600" : "text-slate-800"
                  }`}
                >
                  {card.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">
            Status de Reposição de Estoque
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {produtos.map((p) => {
            const critical = p.saldo < p.minimo;
            return (
              <div
                key={p.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition"
              >
                <div>
                  <span className="font-medium text-slate-800">
                    {p.descricao}
                  </span>
                  <span className="text-slate-400 text-sm ml-2">
                    ({p.codigo})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">
                    Saldo: <strong className="text-slate-800">{p.saldo}</strong>{" "}
                    (Mín: {p.minimo})
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      critical
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {critical ? "COMPRAR" : "OK"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
