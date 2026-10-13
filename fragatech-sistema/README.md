# FragaTech v3.0 — Sistema de Gestão Operacional SENAI

## Novidades v3.0

### Funcionalidades didáticas
- **Pedidos de Venda** — cliente → pedido → faturar (baixa estoque + NF-e)
- **Fornecedores & Ordens de Compra** — OC → receber → entrada de estoque
- **Relatórios** — estoque baixo, faturamento do dia, clientes por condição, histórico com filtro de data
- **Exportação CSV** de clientes, movimentações, NF-es e progresso da turma
- **Impressão / PDF** do DANFE simulado
- **Validação de CNPJ/CPF** (dígitos verificadores) e e-mail

### Painel do Professor
- Login: `professor` / `senai2026`
- Ver progresso de todos os alunos (práticas, pedidos, NF-es, faturamento)
- Filtrar por turma (QUA.532.001 / QUA.162.002)
- Resetar progresso de um aluno
- Exportar relatório da turma em CSV

### Login dos alunos
- Login = RA | Senha = RA (planilha de acesso)
- Progresso individual salvo por aluno

## Como rodar

```bash
npm install
npm run dev
```

http://localhost:3000

## Fluxo didático completo

1. Cadastrar / editar clientes
2. Cadastrar produtos e movimentar estoque
3. Criar pedido de venda → faturar
4. Emitir NF-e avulsa ou via pedido
5. Cadastrar fornecedor → OC → receber mercadoria
6. Consultar relatórios e exportar CSV
7. Marcar práticas no Modo Didático

## Stack

Next.js 15 • React 19 • TypeScript • Tailwind • Zustand • Lucide

---
SENAI-MT • Turmas QUA.532.001 & QUA.162.002 • FragaTech v3.0
