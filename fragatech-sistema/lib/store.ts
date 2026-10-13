"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cliente, Produto, Movimentacao, DocumentoFiscal } from "./types";
import { generateId } from "./utils";

interface Store {
  clientes: Cliente[];
  produtos: Produto[];
  movimentacoes: Movimentacao[];
  documentos: DocumentoFiscal[];
  faturamento: number;

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
}

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

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      clientes: initialClientes,
      produtos: initialProdutos,
      movimentacoes: [],
      documentos: [],
      faturamento: 128300,

      addCliente: (c) =>
        set((s) => ({
          clientes: [...s.clientes, { ...c, id: generateId() }],
        })),

      updateCliente: (id, data) =>
        set((s) => ({
          clientes: s.clientes.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      removeCliente: (id) =>
        set((s) => ({
          clientes: s.clientes.filter((c) => c.id !== id),
        })),

      addProduto: (p) =>
        set((s) => ({
          produtos: [...s.produtos, { ...p, id: generateId() }],
        })),

      updateProduto: (id, data) =>
        set((s) => ({
          produtos: s.produtos.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      removeProduto: (id) =>
        set((s) => ({
          produtos: s.produtos.filter((p) => p.id !== id),
        })),

      movimentar: (produtoId, tipo, qtd, observacao) => {
        if (qtd <= 0) return { ok: false, msg: "Quantidade deve ser maior que zero." };
        const prod = get().produtos.find((p) => p.id === produtoId);
        if (!prod) return { ok: false, msg: "Produto não encontrado." };
        if (tipo === "SAIDA" && prod.saldo < qtd)
          return { ok: false, msg: `Estoque insuficiente. Disponível: ${prod.saldo}` };

        const novoSaldo =
          tipo === "ENTRADA" ? prod.saldo + qtd : prod.saldo - qtd;

        set((s) => ({
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
        }));
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

        // Baixa estoque
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

        set((s) => ({
          documentos: [doc, ...s.documentos],
          faturamento: s.faturamento + valorTotal,
        }));

        return {
          ok: true,
          msg: `Documento ${numero} emitido com sucesso!`,
          doc,
        };
      },
    }),
    {
      name: "fragatech-v2-storage",
    }
  )
);
