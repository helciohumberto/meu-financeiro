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

Por padrão, a API roda em `http://localhost:3000` (confirme em `src/server.js`).

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface React roda no `http://localhost:5173` (ou porta que o Vite atribuir).

### 3) (Opcional) App wrapper

No `app` há scripts para iniciar a aplicação localmente. Use conforme sua configuração local.

## 🧠 Requisitos

- Node.js 18+ (recomendado)
- npm 10+
- MongoDB local ou Atlas (configurar `MONGO_URI` no `.env` do backend)

## 🔐 Variáveis de ambiente (backend)

No `backend`, crie um `.env` com algo como:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/meu-financeiro
JWT_SECRET=seuSegredo
```

## 🧪 Testes (se houver)

Nenhum script de teste configurado atualmente. Para validar execução, inicie backend e frontend, então use a interface.

## 📌 Melhorias futuras

- Autenticação por usuário e login (JWT)
- Paginação e filtros de despesas
- Exportar / importar CSV
- Dashboard com metas, alertas e previsões

## 📝 Observações

Este README foi gerado com base na estrutura do projeto existente. Ajuste os detalhes de porta, variáveis e comportamentos de API conforme suas implementações.
