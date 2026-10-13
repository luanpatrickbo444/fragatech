"use client";

import {
  GraduationCap,
  CheckCircle2,
  Circle,
  ArrowRight,
  Package,
  FileText,
  Users,
  Truck,
  RotateCcw,
} from "lucide-react";
import type { Page } from "@/lib/types";
import { useStore } from "@/lib/store";

interface Props {
  onNavigate: (page: Page) => void;
  showToast: (msg: string, type: "success" | "error") => void;
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

export function ModoDidatico({ onNavigate, showToast }: Props) {
  const praticasConcluidas = useStore((s) => s.praticasConcluidas);
  const togglePratica = useStore((s) => s.togglePratica);
  const resetProgresso = useStore((s) => s.resetProgresso);
  const user = useStore((s) => s.user);

  const progresso = Math.round(
    (praticasConcluidas.length / praticas.length) * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Modo Didático — Laboratório SENAI
          </h2>
          <p className="text-slate-500 mt-1">
            Progresso de{" "}
            <strong className="text-slate-700">
              {user?.nome.split(" ").slice(0, 2).join(" ")}
            </strong>{" "}
            (salvo automaticamente)
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Resetar todo o progresso e dados deste aluno?")) {
              resetProgresso();
              showToast("Progresso resetado.", "success");
            }
          }}
          className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition"
        >
          <RotateCcw size={13} /> Resetar progresso
        </button>
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
                <span>
                  {praticasConcluidas.length}/{praticas.length} ({progresso}%)
                </span>
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
          const done = praticasConcluidas.includes(p.id);
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
                <button
                  onClick={() => {
                    togglePratica(p.id);
                    showToast(
                      done
                        ? "Prática desmarcada."
                        : "Prática concluída! Progresso salvo.",
                      "success"
                    );
                  }}
                  className="shrink-0"
                >
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
