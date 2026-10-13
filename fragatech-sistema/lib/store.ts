"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Cliente, Produto, Movimentacao, DocumentoFiscal } from "./types";
import { generateId } from "./utils";
import type { Aluno } from "./users";

const initialClientes: Cliente[] = [
  {
    id: "c1",
    razaoSocial: "Cliente Exemplo Ltda",
    cnpj: "00.000.000/0001-99",
    contato: "Ana Souza",
    email: "compras@cliente.com",
    telefone: "(11) 99999-0000",
    condicao: "28 dias",
  },
  {
    id: "c2",
    razaoSocial: "Tech Solutions SA",
    cnpj: "11.222.333/0001-88",
    contato: "Carlos Lima",
    email: "financeiro@techsolutions.com",
    telefone: "(11) 98888-1111",
    condicao: "À Vista",
  },
];

const initialProdutos: Produto[] = [
  {
    id: "p1",
    codigo: "P001",
    descricao: "Notebook Pro 14",
    categoria: "Informática",
    unidade: "UN",
    custo: 3850,
    preco: 4690,
    saldo: 12,
    minimo: 5,
  },
  {
    id: "p2",
    codigo: "P002",
    descricao: 'Monitor 24"',
    categoria: "Informática",
    unidade: "UN",
    custo: 780,
    preco: 999,
    saldo: 18,
    minimo: 8,
  },
  {
    id: "p3",
    codigo: "P003",
    descricao: "Teclado USB",
    categoria: "Periféricos",
    unidade: "UN",
    custo: 65,
    preco: 99,
    saldo: 7,
    minimo: 10,
  },
  {
    id: "p4",
    codigo: "P004",
    descricao: "Mouse USB",
    categoria: "Periféricos",
    unidade: "UN",
    custo: 42,
    preco: 69,
    saldo: 42,
    minimo: 12,
  },
];

interface DataState {
  clientes: Cliente[];
  produtos: Produto[];
  movimentacoes: Movimentacao[];
  documentos: DocumentoFiscal[];
  faturamento: number;
  praticasConcluidas: number[];
}

interface Store extends DataState {
  user: Aluno | null;
  isAuthenticated: boolean;
  login: (aluno: Aluno) => void;
  logout: () => void;

  addCliente: (c: Omit<Cliente, "id">) => void;
  updateCliente: (id: string, c: Partial<Cliente>) => void;
  removeCliente: (id: string) => void;

  addProduto: (p: Omit<Produto, "id">) => void;
  updateProduto: (id: string, p: Partial<Produto>) => void;
  removeProduto: (id: string) => void;

  movimentar: (
    produtoId: string,
    tipo: "ENTRADA" | "SAIDA",
    qtd: number,
    observacao?: string
  ) => { ok: boolean; msg: string };

  emitirDocumento: (data: {
    tipo: string;
    clienteId: string;
    produtoId: string;
    quantidade: number;
  }) => { ok: boolean; msg: string; doc?: DocumentoFiscal };

  togglePratica: (id: number) => void;
  resetProgresso: () => void;
}

const emptyData = (): DataState => ({
  clientes: structuredClone(initialClientes),
  produtos: structuredClone(initialProdutos),
  movimentacoes: [],
  documentos: [],
  faturamento: 128300,
  praticasConcluidas: [],
});

function loadUserData(ra: string): DataState {
  try {
    const raw = localStorage.getItem(`fragatech-data-${ra}`);
    if (raw) return JSON.parse(raw) as DataState;
  } catch {}
  return emptyData();
}

function saveUserData(ra: string, data: DataState) {
  try {
    localStorage.setItem(`fragatech-data-${ra}`, JSON.stringify(data));
  } catch {}
}

function pickData(s: DataState): DataState {
  return {
    clientes: s.clientes,
    produtos: s.produtos,
    movimentacoes: s.movimentacoes,
    documentos: s.documentos,
    faturamento: s.faturamento,
    praticasConcluidas: s.praticasConcluidas,
  };
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      ...emptyData(),

      login: (aluno) => {
        const data = loadUserData(aluno.ra);
        set({
          user: aluno,
          isAuthenticated: true,
          ...data,
        });
      },

      logout: () => {
        const { user } = get();
        if (user) {
          const {
            clientes,
            produtos,
            movimentacoes,
            documentos,
            faturamento,
            praticasConcluidas,
          } = get();
          saveUserData(user.ra, {
            clientes,
            produtos,
            movimentacoes,
            documentos,
            faturamento,
            praticasConcluidas,
          });
        }
        set({
          user: null,
          isAuthenticated: false,
          ...emptyData(),
        });
      },

      addCliente: (c) => {
        set((s) => {
          const next = {
            ...s,
            clientes: [...s.clientes, { ...c, id: generateId() }],
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
      },

      updateCliente: (id, data) => {
        set((s) => {
          const next = {
            ...s,
            clientes: s.clientes.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
      },

      removeCliente: (id) => {
        set((s) => {
          const next = {
            ...s,
            clientes: s.clientes.filter((c) => c.id !== id),
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
      },

      addProduto: (p) => {
        set((s) => {
          const next = {
            ...s,
            produtos: [...s.produtos, { ...p, id: generateId() }],
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
      },

      updateProduto: (id, data) => {
        set((s) => {
          const next = {
            ...s,
            produtos: s.produtos.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
      },

      removeProduto: (id) => {
        set((s) => {
          const next = {
            ...s,
            produtos: s.produtos.filter((p) => p.id !== id),
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
      },

      movimentar: (produtoId, tipo, qtd, observacao) => {
        if (qtd <= 0)
          return { ok: false, msg: "Quantidade deve ser maior que zero." };
        const prod = get().produtos.find((p) => p.id === produtoId);
        if (!prod) return { ok: false, msg: "Produto não encontrado." };
        if (tipo === "SAIDA" && prod.saldo < qtd)
          return {
            ok: false,
            msg: `Estoque insuficiente. Disponível: ${prod.saldo}`,
          };

        const novoSaldo =
          tipo === "ENTRADA" ? prod.saldo + qtd : prod.saldo - qtd;

        set((s) => {
          const next = {
            ...s,
            produtos: s.produtos.map((p) =>
              p.id === produtoId ? { ...p, saldo: novoSaldo } : p
            ),
            movimentacoes: [
              {
                id: generateId(),
                produtoId,
                tipo,
                quantidade: qtd,
                data: new Date().toISOString(),
                observacao,
              },
              ...s.movimentacoes,
            ],
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });

        return {
          ok: true,
          msg: `${tipo === "ENTRADA" ? "Entrada" : "Saída"} de ${qtd} unidade(s) registrada.`,
        };
      },

      emitirDocumento: (data) => {
        const { produtos, clientes } = get();
        const prod = produtos.find((p) => p.id === data.produtoId);
        const cli = clientes.find((c) => c.id === data.clienteId);

        if (!prod) return { ok: false, msg: "Produto não encontrado." };
        if (!cli) return { ok: false, msg: "Cliente não encontrado." };
        if (data.quantidade <= 0)
          return { ok: false, msg: "Quantidade inválida." };
        if (prod.saldo < data.quantidade)
          return {
            ok: false,
            msg: `Estoque insuficiente para emitir. Disponível: ${prod.saldo}`,
          };

        const valorTotal = prod.preco * data.quantidade;
        const numero = `NF-${Date.now().toString().slice(-8)}`;

        get().movimentar(
          data.produtoId,
          "SAIDA",
          data.quantidade,
          `NF-e ${numero}`
        );

        const doc: DocumentoFiscal = {
          id: generateId(),
          tipo: data.tipo,
          clienteId: data.clienteId,
          produtoId: data.produtoId,
          quantidade: data.quantidade,
          valorTotal,
          data: new Date().toISOString(),
          numero,
        };

        set((s) => {
          const next = {
            ...s,
            documentos: [doc, ...s.documentos],
            faturamento: s.faturamento + valorTotal,
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });

        return {
          ok: true,
          msg: `Documento ${numero} emitido com sucesso!`,
          doc,
        };
      },

      togglePratica: (id) => {
        set((s) => {
          const exists = s.praticasConcluidas.includes(id);
          const next = {
            ...s,
            praticasConcluidas: exists
              ? s.praticasConcluidas.filter((x) => x !== id)
              : [...s.praticasConcluidas, id],
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
      },

      resetProgresso: () => {
        const { user } = get();
        const data = emptyData();
        set({ ...data });
        if (user) saveUserData(user.ra, data);
      },
    }),
    {
      name: "fragatech-auth",
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.user && state.isAuthenticated) {
          const data = loadUserData(state.user.ra);
          useStore.setState(data);
        }
      },
    }
  )
);
