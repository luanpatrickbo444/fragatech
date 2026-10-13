"use client";

import { useState } from "react";
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  ArrowRight,
  Package,
  FileText,
  Users,
  Truck,
} from "lucide-react";
import type { Page } from "@/lib/types";

interface Props {
  onNavigate: (page: Page) => void;
}

const praticas = [
  {
    id: 1,
    titulo: "Recebimento e Estoque",
    descricao:
      "Receba a mercadoria no sistema, atualize os saldos e verifique se algum item ficou abaixo do estoque mínimo.",
    icon: Package,
    page: "estoque" as Page,
    passos: [
      "Vá em Estoque & Produtos",
      "Registre uma ENTRADA de 10 unidades do Teclado USB",
      "Verifique o status de reposição no Dashboard",
    ],
  },
  {
    id: 2,
    titulo: "Cadastro de Cliente",
    descricao:
      "Cadastre um novo cliente com dados completos e condição de pagamento.",
    icon: Users,
    page: "clientes" as Page,
    passos: [
      "Vá em Clientes",
      "Preencha Razão Social, CNPJ e demais campos",
      "Salve e confira na base de clientes",
    ],
  },
  {
    id: 3,
    titulo: "Faturamento & Emissão",
    descricao:
      "Com o pedido aprovado, realize a simulação de emissão de NF-e e verifique os dados fiscais.",
    icon: FileText,
    page: "fiscal" as Page,
    passos: [
      "Vá em Fiscal & Faturamento",
      "Selecione cliente, produto e quantidade",
      "Emita o documento e observe a baixa de estoque + aumento do faturamento",
    ],
  },
  {
    id: 4,
    titulo: "Comunicação Corporativa",
    descricao:
      "Redija um e-mail profissional de confirmação de pedido seguindo o checklist de segurança.",
    icon: Truck,
    page: "email" as Page,
    passos: [
      "Vá em E-mail Corporativo",
      "Ajuste o destinatário e a mensagem",
      "Revise o checklist de segurança antes de enviar",
    ],
  },
];

export function ModoDidatico({ onNavigate }: Props) {
  const [concluidas, setConcluidas] = useState<number[]>([]);

  const toggle = (id: number) => {
    setConcluidas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const progresso = Math.round((concluidas.length / praticas.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Modo Didático — Laboratório SENAI
        </h2>
        <p className="text-slate-500 mt-1">
          Siga a sequência de atividades para praticar a visão sistêmica.
        </p>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-3">
          <GraduationCap size={28} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-lg">Desafio Prático Integrado</h3>
            <p className="text-blue-100 text-sm mt-1">
              Cliente → Pedido → Estoque → Faturamento → Transporte → Entrega
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progresso</span>
                <span>{progresso}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Práticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {praticas.map((p) => {
          const Icon = p.icon;
          const done = concluidas.includes(p.id);
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition ${
                done
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "border-slate-100"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      done
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase">
                      Prática {p.id}
                    </span>
                    <h4 className="font-semibold text-slate-800">
                      {p.titulo}
                    </h4>
                  </div>
                </div>
                <button onClick={() => toggle(p.id)} className="shrink-0">
                  {done ? (
                    <CheckCircle2 size={22} className="text-emerald-500" />
                  ) : (
                    <Circle size={22} className="text-slate-300" />
                  )}
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-3">{p.descricao}</p>
              <ol className="space-y-1.5 mb-4">
                {p.passos.map((passo, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-600 flex items-start gap-2"
                  >
                    <span className="text-blue-500 font-bold">{i + 1}.</span>
                    {passo}
                  </li>
                ))}
              </ol>
              <button
                onClick={() => onNavigate(p.page)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Ir para a prática <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
