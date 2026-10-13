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
  pedidoId?: string;
};

export type Fornecedor = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  contato: string;
  email: string;
  telefone: string;
};

export type ItemPedido = {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
};

export type Pedido = {
  id: string;
  numero: string;
  clienteId: string;
  itens: ItemPedido[];
  status: "ABERTO" | "FATURADO" | "CANCELADO";
  data: string;
  valorTotal: number;
  observacao?: string;
};

export type OrdemCompra = {
  id: string;
  numero: string;
  fornecedorId: string;
  itens: ItemPedido[];
  status: "ABERTA" | "RECEBIDA" | "CANCELADA";
  data: string;
  valorTotal: number;
  observacao?: string;
};

export type Page =
  | "dashboard"
  | "clientes"
  | "estoque"
  | "pedidos"
  | "fiscal"
  | "fornecedores"
  | "relatorios"
  | "email"
  | "didatico"
  | "professor";
