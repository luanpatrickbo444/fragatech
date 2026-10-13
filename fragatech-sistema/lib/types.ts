export type Cliente = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  contato: string;
  email: string;
  telefone: string;
  condicao: string;
};

export type Produto = {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  unidade: string;
  custo: number;
  preco: number;
  saldo: number;
  minimo: number;
};

export type Movimentacao = {
  id: string;
  produtoId: string;
  tipo: "ENTRADA" | "SAIDA";
  quantidade: number;
  data: string;
  observacao?: string;
};

export type DocumentoFiscal = {
  id: string;
  tipo: string;
  clienteId: string;
  produtoId: string;
  quantidade: number;
  valorTotal: number;
  data: string;
  numero: string;
};

export type Page =
  | "dashboard"
  | "clientes"
  | "estoque"
  | "fiscal"
  | "email"
  | "didatico";
