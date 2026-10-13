"use client";

import { useState } from "react";
import { LogIn, Eye, EyeOff, GraduationCap } from "lucide-react";
import { autenticar } from "@/lib/users";
import { useStore } from "@/lib/store";

export function Login() {
  const login = useStore((s) => s.login);
  const [ra, setRa] = useState("");
  const [senha, setSenha] = useState("");
  const [show, setShow] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    // pequena demora para feedback visual
    setTimeout(() => {
      const aluno = autenticar(ra, senha);
      if (aluno) {
        login(aluno);
      } else {
        setErro("RA ou senha incorretos. Tente novamente.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 mb-4">
            <span className="text-white font-bold text-2xl">FT</span>
          </div>
          <h1 className="text-2xl font-bold text-white">FragaTech</h1>
          <p className="text-slate-400 text-sm mt-1">
            Sistema de Gestão Operacional • Laboratório SENAI
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="text-blue-600" size={22} />
            <h2 className="text-lg font-semibold text-slate-800">
              Acesso do Aluno
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                RA (Registro Acadêmico)
              </label>
              <input
                type="text"
                value={ra}
                onChange={(e) => setRa(e.target.value)}
                placeholder="Ex: 660867"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                Senha
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-2.5 rounded-xl border border-red-100">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} /> Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              <strong className="text-slate-500">Dica:</strong> Use seu RA como
              login e senha (ex: 660867 / 660867).
              <br />
              Professor: <code className="text-blue-600">professor</code> /{" "}
              <code className="text-blue-600">senai2026</code>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          SENAI-MT • Gestão Operacional v2.0 • Turmas QUA.532.001 & QUA.162.002
        </p>
      </div>
    </div>
  );
}
