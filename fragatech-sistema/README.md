# FragaTech — Sistema de Gestão Operacional v2.0

Versão **melhorada e completa** do laboratório prático SENAI.

## O que foi melhorado

- ✅ **Persistência real** com localStorage (dados não somem ao recarregar)
- ✅ **CRUD completo** de Clientes e Produtos (criar, editar, excluir)
- ✅ **Integração entre módulos**: emitir NF-e baixa estoque + atualiza faturamento
- ✅ **Validação de estoque** (não permite saída maior que o saldo)
- ✅ **Busca** em tabelas de clientes e produtos
- ✅ **Histórico** de movimentações e documentos fiscais
- ✅ **Toast** de feedback visual
- ✅ **Sidebar responsiva** (mobile com menu hambúrguer)
- ✅ **Modo Didático** interativo com progresso e checklist
- ✅ **Preview DANFE** realista na emissão fiscal
- ✅ Código limpo, tipado e modular

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (estado + persistência)
- Lucide React (ícones)

## Estrutura

```
app/
  layout.tsx
  page.tsx
  globals.css
components/
  Sidebar.tsx
  Dashboard.tsx
  Clientes.tsx
  Estoque.tsx
  Fiscal.tsx
  Email.tsx
  ModoDidatico.tsx
  Toast.tsx
lib/
  types.ts
  store.ts
  utils.ts
```

## Deploy no Vercel

```bash
npx vercel
```

Ou conecte o repositório no dashboard da Vercel.

---

Desenvolvido para fins didáticos — Laboratório SENAI  
FragaTech v2.0
