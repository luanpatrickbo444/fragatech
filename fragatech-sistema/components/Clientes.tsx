"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Cliente } from "@/lib/types";
import { validarCnpjOuCpf, validarEmail, maskCnpjCpf } from "@/lib/utils";
import type { ToastType } from "./Toast";

interface Props {
  showToast: (msg: string, type: ToastType) => void;
}

const CONDICOES = ["À Vista", "14 dias", "28 dias", "30/60 dias"];

export function Clientes({ showToast }: Props) {
  const { clientes, addCliente, updateCliente, removeCliente } = useStore();
  const [form, setForm] = useState({
    razaoSocial: "",
    cnpj: "",
    contato: "",
    email: "",
    telefone: "",
    condicao: "28 dias",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = clientes.filter(
    (c) =>
      c.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
      c.cnpj.includes(search) ||
      c.contato.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({
      razaoSocial: "",
      cnpj: "",
      contato: "",
      email: "",
      telefone: "",
      condicao: "28 dias",
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.razaoSocial.trim() || !form.cnpj.trim()) {
      showToast("Razão Social e CNPJ são obrigatórios.", "error");
      return;
    }
    if (!validarCnpjOuCpf(form.cnpj)) {
      showToast("CNPJ/CPF inválido. Verifique os dígitos.", "error");
      return;
    }
    if (form.email && !validarEmail(form.email)) {
      showToast("E-mail inválido.", "error");
      return;
    }
    if (editingId) {
      updateCliente(editingId, form);
      showToast("Cliente atualizado com sucesso!", "success");
    } else {
      addCliente(form);
      showToast("Cliente cadastrado com sucesso!", "success");
    }
    resetForm();
  };

  const startEdit = (c: Cliente) => {
    setForm({
      razaoSocial: c.razaoSocial,
      cnpj: c.cnpj,
      contato: c.contato,
      email: c.email,
      telefone: c.telefone,
      condicao: c.condicao,
    });
    setEditingId(c.id);
  };

  const handleDelete = (id: string, nome: string) => {
    if (confirm(`Excluir o cliente "${nome}"?`)) {
      removeCliente(id);
      showToast("Cliente removido.", "success");
      if (editingId === id) resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Cadastro de Clientes</h2>
        <p className="text-slate-500 mt-1">Gerencie a base de clientes da FragaTech.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" />
            {editingId ? "Editar Cliente" : "Novo Cliente"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { key: "razaoSocial", label: "Razão Social", type: "text" },
              { key: "cnpj", label: "CNPJ / CPF", type: "text" },
              { key: "contato", label: "Pessoa de Contato", type: "text" },
              { key: "email", label: "E-mail Financeiro", type: "email" },
              { key: "telefone", label: "Telefone", type: "tel" },
            ].map((f) => (
              <input
                key={f.key}
                type={f.type}
                placeholder={f.label}
                value={(form as any)[f.key]}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
            <select
              value={form.condicao}
              onChange={(e) => setForm({ ...form, condicao: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CONDICOES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition text-sm"
              >
                {editingId ? "Salvar Alterações" : "Salvar Cliente"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm hover:bg-slate-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-800">Base de Clientes</h3>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500">
                  <th className="px-6 py-3 font-medium">Razão Social</th>
                  <th className="px-4 py-3 font-medium">CNPJ</th>
                  <th className="px-4 py-3 font-medium">Contato</th>
                  <th className="px-4 py-3 font-medium">E-mail</th>
                  <th className="px-4 py-3 font-medium">Condição</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3.5 font-medium text-slate-800">
                        {c.razaoSocial}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{c.cnpj}</td>
                      <td className="px-4 py-3.5 text-slate-600">{c.contato}</td>
                      <td className="px-4 py-3.5 text-slate-600">{c.email}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                          {c.condicao}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(c)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.razaoSocial)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                            title="Excluir"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
