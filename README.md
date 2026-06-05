# Meu Financeiro

Aplicação de gestão financeira pessoal full-stack (Node.js + React + MongoDB) para cadastro de categorias, despesas e geração de relatórios visuais.

## 🔧 Estrutura do Projeto

- `backend/` — API Express + MongoDB (mongoose)
  - `src/server.js` — servidor principal
  - `src/routes/` — rotas (categories, expenses, reports, settings)
  - `src/controllers/` — lógica dos endpoints
  - `src/models/` — modelos do Mongoose
  - `src/services/` — lógica de negócio e organização de dados
- `frontend/` — SPA React com Vite
  - `src/App.jsx`, `src/main.jsx` — bootstrap da app
  - `src/pages/` — telas: Dashboard, Categories, Expenses, Settings, Home
  - `src/components/` — cards, gráficos, sidebar, layout
  - `src/services/api.js` — cliente Axios para chamadas à API
- `app/` — scripts para iniciar a app localmente no Electron/Chrome (para produção local? depends)
- `data/` — local para armazenar dados temporários/JSON (se houver configuração)

## ✅ Funcionalidades Principais

- Cadastro, edição e remoção de categorias
- Cadastro, edição e remoção de despesas
- Resumo financeiro por mês e por categoria
- Gráficos de pizza eLinha para análise de gastos
- Configurações de preferências e exibição (Tema, etc.)

## 🚀 Como rodar localmente

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Por padrão, a API roda em `http://localhost:3001` (configurável via `.env`).

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface React roda no `http://localhost:5173` (ou porta que o Vite atribuir).

### 3) App desktop (Electron) — modo dev

```bash
cd app
npm install
npm run dev
```

Em desenvolvimento, o Electron sobe o backend automaticamente e carrega o
frontend a partir do dev server do Vite (`http://localhost:5173`), então deixe
o frontend rodando (passo 2) antes de abrir o app.

## 📦 Gerar o instalador (build de produção)

```bash
cd app
npm run build
```

Isso compila o frontend (`vite build`) e empacota tudo com o `electron-builder`,
gerando o instalador em `app/dist/` (ex.: `Meu Financeiro Setup 1.0.0.exe`).

No app empacotado:
- o **backend roda dentro do próprio processo do Electron** (Node embutido — não
  é preciso ter `node` instalado na máquina do usuário);
- o **frontend compilado** é carregado via `file://` (usa `HashRouter`);
- backend e frontend vão embutidos em `resources/` (`extraResources`).

> ⚠️ **Pré-requisito de runtime: MongoDB.** O app espera um MongoDB acessível em
> `mongodb://localhost:27017/meu_financeiro` (ou no `MONGO_URI` configurado). Sem
> o Mongo rodando, a interface abre mas as telas que dependem de dados retornam
> erro. Instale o MongoDB Community Server (ou aponte `MONGO_URI` para um Atlas).

## 🧠 Requisitos

- Node.js 18+ (recomendado)
- npm 10+
- MongoDB local ou Atlas

## 🔐 Variáveis de ambiente (backend)

No `backend`, copie o `.env.example` para `.env` e ajuste se necessário:

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/meu_financeiro
```

Em produção (app empacotado) o `.env` **não** é incluído; o backend usa os
valores padrão acima caso nenhuma variável seja definida.

## 🧪 Testes (se houver)

Nenhum script de teste configurado atualmente. Para validar execução, inicie backend e frontend, então use a interface.

## 📌 Melhorias futuras

- Autenticação por usuário e login (JWT)
- Paginação e filtros de despesas
- Exportar / importar CSV
- Dashboard com metas, alertas e previsões

## 📝 Observações

Este README foi gerado com base na estrutura do projeto existente. Ajuste os detalhes de porta, variáveis e comportamentos de API conforme suas implementações.
