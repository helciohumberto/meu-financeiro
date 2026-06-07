require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");

const remessasRoutes = require("./routes/remessas");

const PORT = process.env.PORT || 3001;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/meu_financeiro";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use("/remessas", remessasRoutes);
app.use("/", routes);

function start() {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => console.error("Erro MongoDB:", err));

  return app.listen(PORT, () =>
    console.log(`Backend rodando na porta ${PORT}`)
  );
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
