# Meu Financeiro

Aplicação desktop de gestão financeira pessoal desenvolvida com Electron, React e Node.js. Pensada para quem vive na Europa e quer acompanhar as despesas mensais, controlar remessas para o Brasil e perceber para onde vai o dinheiro — tudo num único lugar, sem depender de serviços em nuvem.

![Plataforma](https://img.shields.io/badge/plataforma-Windows-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![Electron](https://img.shields.io/badge/Electron-desktop-47848f)
![MongoDB](https://img.shields.io/badge/MongoDB-local-4ea94b)
![Licença](https://img.shields.io/badge/licença-MIT-lightgrey)

---

## O que faz

- Registo de despesas com categoria, valor e data
- Meta mensal de gastos com barra de progresso em tempo real
- Controlo de remessas mensais para o Brasil (€ → R$)
- Dashboard com 4 gráficos interativos: distribuição por categoria, evolução mensal, remessas por ano e acumulado diário
- Sugestão automática de categoria por IA (OpenAI)
- Insights mensais gerados por IA com análise do teu comportamento financeiro
- Assistente financeiro por chat — faz perguntas em linguagem natural sobre os teus dados
- Importação e exportação de despesas via CSV
- Modo claro e escuro
- Câmbio EUR → BRL em tempo real
- Tudo corre localmente — os teus dados ficam no teu computador

---

## Stack técnica

| Camada | Tecnologias |
|---|---|
| Desktop | Electron |
| Frontend | React 18, Vite, React Router v6 |
| UI | Material UI v5, Recharts |
| Estado | TanStack Query v5 (React Query) |
| Backend | Node.js, Express |
| Base de dados | MongoDB, Mongoose |
| IA | OpenAI API (gpt-4o-mini) |

---

## Estrutura do projeto

```
meu-financeiro/
├── app/              # Electron (main process, build, empacotamento)
├── backend/          # API Express + MongoDB
│   ├── src/
│   │   ├── controllers/   # lógica dos endpoints
│   │   ├── models/        # esquemas Mongoose
│   │   └── routes/        # rotas da API
│   └── .env               # variáveis de ambiente (não vai para o git)
├── frontend/         # SPA React + Vite
│   └── src/
│       ├── components/    # gráficos, cards, sidebar, chat IA
│       ├── pages/         # Home, Dashboard, Lançamentos, Remessas, Categorias, Definições
│       ├── services/      # cliente Axios, câmbio
│       └── utils/         # formatação, CSV
└── run-app.cmd       # atalho para arrancar em desenvolvimento
```

---

## Pré-requisitos

- **Node.js 18+** e **npm 10+**
- **MongoDB Community Server** a correr localmente (ou ligação Atlas)
- Chave da **OpenAI API** (opcional — só necessária para as funcionalidades de IA)

---

## Instalação e arranque em desenvolvimento

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # edita o .env com os teus valores
npm run dev
```

A API fica disponível em `http://localhost:3001`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface abre em `http://localhost:5173`.

### 3. App Electron (modo dev)

```bash
cd app
npm install
npm run dev
```

O Electron inicia o backend automaticamente e carrega o frontend a partir do servidor Vite. Deixa o frontend a correr (passo 2) antes de abrir o app.

### Atalho rápido (Windows)

```
run-app.cmd
```

Abre o Electron em modo de desenvolvimento com um único duplo-clique.

---

## Gerar o instalador (produção)

```bash
cd app
npm run build
```

O comando compila o frontend com Vite e empacota tudo com `electron-builder`. O instalador gerado fica em `app/dist/` (ex.: `Meu Financeiro Setup 1.0.0.exe`).

No executável final:
- o backend corre **dentro do próprio processo Electron** — não é necessário ter Node.js instalado na máquina do utilizador
- o frontend compilado é carregado via `file://` (usa HashRouter)
- backend e frontend ficam embutidos em `resources/`

---

## Variáveis de ambiente

Copia `backend/.env.example` para `backend/.env` e preenche:

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/meu_financeiro
OPENAI_API_KEY=         # cola aqui a tua chave da OpenAI
```

A chave da OpenAI é opcional. Sem ela, as funcionalidades de IA ficam desativadas com uma mensagem de aviso — o resto da aplicação funciona normalmente.

> Em produção (app empacotado), o `.env` não é incluído. O backend usa os valores padrão acima caso nenhuma variável de ambiente esteja definida.

---

## Funcionalidades de IA

Com a `OPENAI_API_KEY` configurada, ficam disponíveis:

**Sugestão de categoria** — ao registar uma despesa, clica no botão IA junto ao campo de categoria e o modelo sugere automaticamente a categoria com base na descrição.

**Insights mensais** — o Dashboard apresenta um card com 2 a 3 observações geradas automaticamente sobre os teus gastos do mês.

**Assistente financeiro** — botão flutuante em todas as páginas. Faz perguntas em linguagem natural como:
- *"Quanto gastei em restaurantes este mês?"*
- *"Qual foi a categoria com mais gastos nos últimos 3 meses?"*
- *"Estou dentro da meta?"*

Todas as chamadas à IA passam pelo backend — a chave nunca é exposta ao frontend.

---

## MongoDB

O app espera um MongoDB acessível em `mongodb://localhost:27017/meu_financeiro`. Sem o Mongo a correr, a interface abre mas as páginas que dependem de dados retornam erro.

Opções:
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) — instalação local
- [MongoDB Atlas](https://www.mongodb.com/atlas) — cloud gratuito, basta substituir o `MONGO_URI`

---

## Desenvolvido por

**Hélcio Humberto**
