# FragaTech — Sistema de Gestão Operacional v2.1

Versão **com login por aluno** e **progresso individual salvo**.

## Novidades v2.1

- ✅ **Login por RA** (todos os alunos da planilha QUA.532.001 e QUA.162.002)
- ✅ **Senha = RA** (padrão da planilha de acesso de rede)
- ✅ **Progresso individual**: cada aluno tem seus próprios clientes, estoque, faturamento e práticas concluídas
- ✅ Dados salvos no navegador (localStorage por RA)
- ✅ Login do professor: `professor` / `senai2026`
- ✅ Exibe nome e turma do aluno logado na sidebar
- ✅ Botão Sair + Resetar progresso

## Como fazer login

| Tipo       | Login       | Senha      |
|------------|-------------|------------|
| Aluno      | Seu RA      | Seu RA     |
| Professor  | professor   | senai2026  |

Exemplos de alunos:
- `660867` / `660867` → Alberto Eduardo de Souza Silva
- `594339` / `594339` → Emilly Vitória Vieira dos Santos
- `663663` / `663663` → Ana Laura Lima Gonçalves

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Deploy no Vercel

```bash
npx vercel
```

## Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + Lucide
- Zustand (auth + persistência por aluno)

## Estrutura

```
app/
components/
  Login.tsx          ← tela de login
  Sidebar.tsx        ← mostra aluno logado + sair
  ...
lib/
  users.ts           ← lista completa de alunos da planilha
  store.ts           ← auth + dados isolados por RA
```

---

SENAI-MT • Turmas QUA.532.001 & QUA.162.002  
FragaTech v2.1
