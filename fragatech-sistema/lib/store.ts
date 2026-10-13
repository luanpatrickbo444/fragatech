"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Cliente, Produto, Movimentacao, DocumentoFiscal,
  Fornecedor, Pedido, OrdemCompra, ItemPedido,
} from "./types";
import { generateId } from "./utils";
import type { Aluno } from "./users";
import { ALUNOS, PROFESSOR } from "./users";

const initialClientes: Cliente[] = [
  { id: "c1", razaoSocial: "Cliente Exemplo Ltda", cnpj: "00.000.000/0001-99", contato: "Ana Souza", email: "compras@cliente.com", telefone: "(11) 99999-0000", condicao: "28 dias" },
  { id: "c2", razaoSocial: "Tech Solutions SA", cnpj: "11.222.333/0001-88", contato: "Carlos Lima", email: "financeiro@techsolutions.com", telefone: "(11) 98888-1111", condicao: "À Vista" },
];

const initialProdutos: Produto[] = [
  { id: "p1", codigo: "P001", descricao: "Notebook Pro 14", categoria: "Informática", unidade: "UN", custo: 3850, preco: 4690, saldo: 12, minimo: 5 },
  { id: "p2", codigo: "P002", descricao: 'Monitor 24"', categoria: "Informática", unidade: "UN", custo: 780, preco: 999, saldo: 18, minimo: 8 },
  { id: "p3", codigo: "P003", descricao: "Teclado USB", categoria: "Periféricos", unidade: "UN", custo: 65, preco: 99, saldo: 7, minimo: 10 },
  { id: "p4", codigo: "P004", descricao: "Mouse USB", categoria: "Periféricos", unidade: "UN", custo: 42, preco: 69, saldo: 42, minimo: 12 },
];

const initialFornecedores: Fornecedor[] = [
  { id: "f1", razaoSocial: "Distribuidora Tech Brasil Ltda", cnpj: "12.345.678/0001-90", contato: "Roberto Alves", email: "vendas@techbrasil.com", telefone: "(11) 3333-4444" },
  { id: "f2", razaoSocial: "Periféricos & Cia", cnpj: "98.765.432/0001-10", contato: "Mariana Costa", email: "contato@perifericos.com", telefone: "(11) 5555-6666" },
];

interface DataState {
  clientes: Cliente[];
  produtos: Produto[];
  movimentacoes: Movimentacao[];
  documentos: DocumentoFiscal[];
  fornecedores: Fornecedor[];
  pedidos: Pedido[];
  ordensCompra: OrdemCompra[];
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

  addFornecedor: (f: Omit<Fornecedor, "id">) => void;
  updateFornecedor: (id: string, f: Partial<Fornecedor>) => void;
  removeFornecedor: (id: string) => void;

  movimentar: (produtoId: string, tipo: "ENTRADA" | "SAIDA", qtd: number, observacao?: string) => { ok: boolean; msg: string };

  criarPedido: (clienteId: string, itens: ItemPedido[], observacao?: string) => { ok: boolean; msg: string; pedido?: Pedido };
  faturarPedido: (pedidoId: string) => { ok: boolean; msg: string };
  cancelarPedido: (pedidoId: string) => void;

  criarOrdemCompra: (fornecedorId: string, itens: ItemPedido[], observacao?: string) => { ok: boolean; msg: string };
  receberOrdemCompra: (ocId: string) => { ok: boolean; msg: string };
  cancelarOrdemCompra: (ocId: string) => void;

  emitirDocumento: (data: { tipo: string; clienteId: string; produtoId: string; quantidade: number; pedidoId?: string }) => { ok: boolean; msg: string; doc?: DocumentoFiscal };

  togglePratica: (id: number) => void;
  resetProgresso: () => void;
  /** Professor: reseta dados de um RA específico */
  resetAluno: (ra: string) => void;
}

const emptyData = (): DataState => ({
  clientes: structuredClone(initialClientes),
  produtos: structuredClone(initialProdutos),
  movimentacoes: [],
  documentos: [],
  fornecedores: structuredClone(initialFornecedores),
  pedidos: [],
  ordensCompra: [],
  faturamento: 128300,
  praticasConcluidas: [],
});

function loadUserData(ra: string): DataState {
  try {
    const raw = localStorage.getItem(`fragatech-data-${ra}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // merge defaults for new fields
      return {
        ...emptyData(),
        ...parsed,
        fornecedores: parsed.fornecedores?.length ? parsed.fornecedores : emptyData().fornecedores,
        pedidos: parsed.pedidos || [],
        ordensCompra: parsed.ordensCompra || [],
      };
    }
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
    fornecedores: s.fornecedores,
    pedidos: s.pedidos,
    ordensCompra: s.ordensCompra,
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
        set({ user: aluno, isAuthenticated: true, ...data });
      },

      logout: () => {
        const { user } = get();
        if (user) saveUserData(user.ra, pickData(get()));
        set({ user: null, isAuthenticated: false, ...emptyData() });
      },

      addCliente: (c) => set((s) => {
        const next = { ...s, clientes: [...s.clientes, { ...c, id: generateId() }] };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),
      updateCliente: (id, data) => set((s) => {
        const next = { ...s, clientes: s.clientes.map((c) => c.id === id ? { ...c, ...data } : c) };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),
      removeCliente: (id) => set((s) => {
        const next = { ...s, clientes: s.clientes.filter((c) => c.id !== id) };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),

      addProduto: (p) => set((s) => {
        const next = { ...s, produtos: [...s.produtos, { ...p, id: generateId() }] };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),
      updateProduto: (id, data) => set((s) => {
        const next = { ...s, produtos: s.produtos.map((p) => p.id === id ? { ...p, ...data } : p) };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),
      removeProduto: (id) => set((s) => {
        const next = { ...s, produtos: s.produtos.filter((p) => p.id !== id) };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),

      addFornecedor: (f) => set((s) => {
        const next = { ...s, fornecedores: [...s.fornecedores, { ...f, id: generateId() }] };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),
      updateFornecedor: (id, data) => set((s) => {
        const next = { ...s, fornecedores: s.fornecedores.map((f) => f.id === id ? { ...f, ...data } : f) };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),
      removeFornecedor: (id) => set((s) => {
        const next = { ...s, fornecedores: s.fornecedores.filter((f) => f.id !== id) };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),

      movimentar: (produtoId, tipo, qtd, observacao) => {
        if (qtd <= 0) return { ok: false, msg: "Quantidade deve ser maior que zero." };
        const prod = get().produtos.find((p) => p.id === produtoId);
        if (!prod) return { ok: false, msg: "Produto não encontrado." };
        if (tipo === "SAIDA" && prod.saldo < qtd)
          return { ok: false, msg: `Estoque insuficiente. Disponível: ${prod.saldo}` };
        const novoSaldo = tipo === "ENTRADA" ? prod.saldo + qtd : prod.saldo - qtd;
        set((s) => {
          const next = {
            ...s,
            produtos: s.produtos.map((p) => p.id === produtoId ? { ...p, saldo: novoSaldo } : p),
            movimentacoes: [{ id: generateId(), produtoId, tipo, quantidade: qtd, data: new Date().toISOString(), observacao }, ...s.movimentacoes],
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
        return { ok: true, msg: `${tipo === "ENTRADA" ? "Entrada" : "Saída"} de ${qtd} unidade(s) registrada.` };
      },

      criarPedido: (clienteId, itens, observacao) => {
        if (!itens.length) return { ok: false, msg: "Adicione pelo menos um item." };
        const { produtos, clientes } = get();
        if (!clientes.find((c) => c.id === clienteId)) return { ok: false, msg: "Cliente não encontrado." };
        for (const item of itens) {
          const p = produtos.find((x) => x.id === item.produtoId);
          if (!p) return { ok: false, msg: "Produto inválido." };
          if (p.saldo < item.quantidade) return { ok: false, msg: `Estoque insuficiente de ${p.descricao} (disp: ${p.saldo}).` };
        }
        const valorTotal = itens.reduce((a, i) => a + i.quantidade * i.precoUnitario, 0);
        const pedido: Pedido = {
          id: generateId(),
          numero: `PV-${Date.now().toString().slice(-6)}`,
          clienteId,
          itens,
          status: "ABERTO",
          data: new Date().toISOString(),
          valorTotal,
          observacao,
        };
        set((s) => {
          const next = { ...s, pedidos: [pedido, ...s.pedidos] };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
        return { ok: true, msg: `Pedido ${pedido.numero} criado!`, pedido };
      },

      faturarPedido: (pedidoId) => {
        const pedido = get().pedidos.find((p) => p.id === pedidoId);
        if (!pedido) return { ok: false, msg: "Pedido não encontrado." };
        if (pedido.status !== "ABERTO") return { ok: false, msg: "Pedido já faturado ou cancelado." };
        // baixa estoque de cada item
        for (const item of pedido.itens) {
          const r = get().movimentar(item.produtoId, "SAIDA", item.quantidade, `Pedido ${pedido.numero}`);
          if (!r.ok) return r;
        }
        // emite doc fiscal do primeiro item (simplificado) ou soma
        const valorTotal = pedido.valorTotal;
        const numero = `NF-${Date.now().toString().slice(-8)}`;
        const firstItem = pedido.itens[0];
        const doc: DocumentoFiscal = {
          id: generateId(),
          tipo: "NF-e (Circulação de Mercadorias)",
          clienteId: pedido.clienteId,
          produtoId: firstItem.produtoId,
          quantidade: pedido.itens.reduce((a, i) => a + i.quantidade, 0),
          valorTotal,
          data: new Date().toISOString(),
          numero,
          pedidoId: pedido.id,
        };
        set((s) => {
          const next = {
            ...s,
            pedidos: s.pedidos.map((p) => p.id === pedidoId ? { ...p, status: "FATURADO" as const } : p),
            documentos: [doc, ...s.documentos],
            faturamento: s.faturamento + valorTotal,
          };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
        return { ok: true, msg: `Pedido faturado! NF-e ${numero} gerada.` };
      },

      cancelarPedido: (pedidoId) => set((s) => {
        const next = { ...s, pedidos: s.pedidos.map((p) => p.id === pedidoId ? { ...p, status: "CANCELADO" as const } : p) };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),

      criarOrdemCompra: (fornecedorId, itens, observacao) => {
        if (!itens.length) return { ok: false, msg: "Adicione pelo menos um item." };
        if (!get().fornecedores.find((f) => f.id === fornecedorId)) return { ok: false, msg: "Fornecedor não encontrado." };
        const valorTotal = itens.reduce((a, i) => a + i.quantidade * i.precoUnitario, 0);
        const oc: OrdemCompra = {
          id: generateId(),
          numero: `OC-${Date.now().toString().slice(-6)}`,
          fornecedorId,
          itens,
          status: "ABERTA",
          data: new Date().toISOString(),
          valorTotal,
          observacao,
        };
        set((s) => {
          const next = { ...s, ordensCompra: [oc, ...s.ordensCompra] };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
        return { ok: true, msg: `Ordem de compra ${oc.numero} criada!` };
      },

      receberOrdemCompra: (ocId) => {
        const oc = get().ordensCompra.find((o) => o.id === ocId);
        if (!oc) return { ok: false, msg: "OC não encontrada." };
        if (oc.status !== "ABERTA") return { ok: false, msg: "OC já recebida ou cancelada." };
        for (const item of oc.itens) {
          get().movimentar(item.produtoId, "ENTRADA", item.quantidade, `OC ${oc.numero}`);
        }
        set((s) => {
          const next = { ...s, ordensCompra: s.ordensCompra.map((o) => o.id === ocId ? { ...o, status: "RECEBIDA" as const } : o) };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
        return { ok: true, msg: `OC recebida! Estoque atualizado.` };
      },

      cancelarOrdemCompra: (ocId) => set((s) => {
        const next = { ...s, ordensCompra: s.ordensCompra.map((o) => o.id === ocId ? { ...o, status: "CANCELADA" as const } : o) };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),

      emitirDocumento: (data) => {
        const { produtos, clientes } = get();
        const prod = produtos.find((p) => p.id === data.produtoId);
        const cli = clientes.find((c) => c.id === data.clienteId);
        if (!prod) return { ok: false, msg: "Produto não encontrado." };
        if (!cli) return { ok: false, msg: "Cliente não encontrado." };
        if (data.quantidade <= 0) return { ok: false, msg: "Quantidade inválida." };
        if (prod.saldo < data.quantidade) return { ok: false, msg: `Estoque insuficiente. Disponível: ${prod.saldo}` };
        const valorTotal = prod.preco * data.quantidade;
        const numero = `NF-${Date.now().toString().slice(-8)}`;
        get().movimentar(data.produtoId, "SAIDA", data.quantidade, `NF-e ${numero}`);
        const doc: DocumentoFiscal = {
          id: generateId(), tipo: data.tipo, clienteId: data.clienteId, produtoId: data.produtoId,
          quantidade: data.quantidade, valorTotal, data: new Date().toISOString(), numero, pedidoId: data.pedidoId,
        };
        set((s) => {
          const next = { ...s, documentos: [doc, ...s.documentos], faturamento: s.faturamento + valorTotal };
          if (s.user) saveUserData(s.user.ra, pickData(next));
          return next;
        });
        return { ok: true, msg: `Documento ${numero} emitido com sucesso!`, doc };
      },

      togglePratica: (id) => set((s) => {
        const exists = s.praticasConcluidas.includes(id);
        const next = { ...s, praticasConcluidas: exists ? s.praticasConcluidas.filter((x) => x !== id) : [...s.praticasConcluidas, id] };
        if (s.user) saveUserData(s.user.ra, pickData(next));
        return next;
      }),

      resetProgresso: () => {
        const { user } = get();
        const data = emptyData();
        set({ ...data });
        if (user) saveUserData(user.ra, data);
      },

      resetAluno: (ra) => {
        localStorage.removeItem(`fragatech-data-${ra}`);
      },
    }),
    {
      name: "fragatech-auth",
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
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

/** Lê progresso de todos os alunos (para painel do professor) */
export function getTurmaProgresso() {
  const result: { aluno: Aluno; praticas: number; pedidos: number; faturamento: number; docs: number }[] = [];
  for (const aluno of ALUNOS) {
    try {
      const raw = localStorage.getItem(`fragatech-data-${aluno.ra}`);
      if (raw) {
        const d = JSON.parse(raw);
        result.push({
          aluno,
          praticas: d.praticasConcluidas?.length || 0,
          pedidos: d.pedidos?.length || 0,
          faturamento: d.faturamento || 0,
          docs: d.documentos?.length || 0,
        });
      } else {
        result.push({ aluno, praticas: 0, pedidos: 0, faturamento: 0, docs: 0 });
      }
    } catch {
      result.push({ aluno, praticas: 0, pedidos: 0, faturamento: 0, docs: 0 });
    }
  }
  return result;
}

export function isProfessor(user: Aluno | null) {
  return user?.ra === PROFESSOR.ra;
}
