"use client";

import { useState, useEffect } from "react";
import { GraduationCap, RotateCcw, Download, Users, RefreshCw } from "lucide-react";
import { getTurmaProgresso } from "@/lib/store";
import { ALUNOS } from "@/lib/users";
import { exportCSV, formatCurrency } from "@/lib/utils";
import type { ToastType } from "./Toast";
import { ConfirmModal } from "./ConfirmModal";

interface Props { showToast: (msg: string, type: ToastType) => void; }

export function Professor({ showToast }: Props) {
  const [data, setData] = useState(getTurmaProgresso());
  const [filtroTurma, setFiltroTurma] = useState("TODAS");
  const [confirmRa, setConfirmRa] = useState<string | null>(null);

  const refresh = () => setData(getTurmaProgresso());

  useEffect(() => { refresh(); }, []);

  const turmas = Array.from(new Set(ALUNOS.map((a) => a.turma)));
  const filtered = filtroTurma === "TODAS" ? data : data.filter((d) => d.aluno.turma === filtroTurma);

  const comProgresso = filtered.filter((d) => d.praticas > 0 || d.pedidos > 0 || d.docs > 0).length;
  const mediaPraticas = filtered.length
    ? (filtered.reduce((a, d) => a + d.praticas, 0) / filtered.length).toFixed(1)
    : "0";

  const handleReset = (ra: string) => {
    localStorage.removeItem(`fragatech-data-${ra}`);
    refresh();
    showToast(`Progresso do RA ${ra} resetado.`, "success");
    setConfirmRa(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <GraduationCap className="text-blue-600" /> Painel do Professor
        </h2>
        <p className="text-slate-500 mt-1">
          Acompanhe o progresso de toda a turma. Dados lidos do navegador local de cada aluno.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Alunos na lista</p>
          <p className="text-2xl font-bold text-slate-800 mt-2">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Com atividade</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{comProgresso}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Média de práticas</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{mediaPraticas} / 4</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Users size={18} /> Progresso da Turma</h3>
          <div className="flex flex-wrap gap-2">
            <select value={filtroTurma} onChange={(e) => setFiltroTurma(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm">
              <option value="TODAS">Todas as turmas</option>
              {turmas.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={refresh} className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm flex items-center gap-1 hover:bg-slate-50">
              <RefreshCw size={14} /> Atualizar
            </button>
            <button
              onClick={() => exportCSV("progresso-turma.csv", filtered.map((d) => ({
                RA: d.aluno.ra, Nome: d.aluno.nome, Turma: d.aluno.turma,
                Praticas: d.praticas, Pedidos: d.pedidos, Documentos: d.docs, Faturamento: d.faturamento,
              })))}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm flex items-center gap-1 hover:bg-blue-700"
            >
              <Download size={14} /> Exportar CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-medium">RA</th>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Turma</th>
                <th className="px-4 py-3 font-medium">Práticas</th>
                <th className="px-4 py-3 font-medium">Pedidos</th>
                <th className="px-4 py-3 font-medium">NF-es</th>
                <th className="px-4 py-3 font-medium">Faturamento</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((d) => (
                <tr key={d.aluno.ra} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-blue-600">{d.aluno.ra}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate">{d.aluno.nome}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{d.aluno.turma}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(d.praticas / 4) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium">{d.praticas}/4</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{d.pedidos}</td>
                  <td className="px-4 py-3 text-center">{d.docs}</td>
                  <td className="px-4 py-3 text-xs">{d.faturamento ? formatCurrency(d.faturamento) : "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setConfirmRa(d.aluno.ra)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                      title="Resetar progresso"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
        <strong>Nota:</strong> O progresso é salvo no navegador de cada aluno (localStorage).
        Este painel só enxerga dados salvos <em>neste mesmo navegador</em>.
        Para visão centralizada real, é necessário um backend (ex.: Supabase).
      </div>

      <ConfirmModal
        open={!!confirmRa}
        title="Resetar progresso"
        message={`Tem certeza que deseja apagar todos os dados do RA ${confirmRa}? Esta ação não pode ser desfeita.`}
        confirmLabel="Resetar"
        danger
        onConfirm={() => confirmRa && handleReset(confirmRa)}
        onCancel={() => setConfirmRa(null)}
      />
    </div>
  );
}
