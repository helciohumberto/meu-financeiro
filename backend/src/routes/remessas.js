const express = require("express");
const Remessa = require("../models/Remessa");
const Finance = require("../models/Finance");

const router = express.Router();

/* ============================================================
   REGISTRAR REMESSA (CRIAR OU ATUALIZAR) + AJUSTAR SALDO
   ============================================================ */
router.post("/", async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    // Verifica se já existe remessa no mês
    const existente = await Remessa.findOne({ month, year });

    let finance = await Finance.findOne();
    if (!finance) finance = await Finance.create({ cash: 0 });

    // Se já existe, precisamos ajustar o saldo corretamente
    if (existente) {
      // devolve o valor antigo para o saldo
      finance.cash += existente.amount;

      // desconta o novo valor
      finance.cash -= Number(amount);

      await finance.save();

      existente.amount = amount;
      await existente.save();

      return res.json({
        message: "Remessa atualizada e saldo ajustado",
        remessa: existente,
        saldoAtual: finance.cash
      });
    }

    // Se NÃO existe, cria nova remessa
    const remessa = await Remessa.create({ month, year, amount });

    // desconta do saldo
    finance.cash -= Number(amount);
    await finance.save();

    res.json({
      message: "Remessa registrada e saldo atualizado",
      remessa,
      saldoAtual: finance.cash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar remessa" });
  }
});

/* ============================================================
   EDITAR REMESSA
   ============================================================ */
router.put("/:id", async (req, res) => {
  try {
    const { amount, month, year } = req.body;

    const remessa = await Remessa.findById(req.params.id);
    if (!remessa) {
      return res.status(404).json({ error: "Remessa não encontrada" });
    }

    let finance = await Finance.findOne();
    if (!finance) finance = await Finance.create({ cash: 0 });

    // devolve o valor antigo
    finance.cash += remessa.amount;

    // desconta o novo valor
    finance.cash -= Number(amount);

    await finance.save();

    remessa.amount = amount;
    remessa.month = month;
    remessa.year = year;
    await remessa.save();

    res.json({
      message: "Remessa atualizada com sucesso",
      remessa,
      saldoAtual: finance.cash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar remessa" });
  }
});

/* ============================================================
   DELETAR REMESSA
   ============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const remessa = await Remessa.findById(req.params.id);
    if (!remessa) {
      return res.status(404).json({ error: "Remessa não encontrada" });
    }

    let finance = await Finance.findOne();
    if (!finance) finance = await Finance.create({ cash: 0 });

    // devolve o valor da remessa deletada
    finance.cash += remessa.amount;
    await finance.save();

    await remessa.deleteOne();

    res.json({
      message: "Remessa deletada e saldo ajustado",
      saldoAtual: finance.cash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar remessa" });
  }
});

/* ============================================================
   TOTAL ANUAL
   ============================================================ */
router.get("/total/:year", async (req, res) => {
  try {
    const { year } = req.params;

    const remessas = await Remessa.find({ year: Number(year) });

    const total = remessas.reduce((sum, r) => sum + r.amount, 0);

    res.json({ total, remessas });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar total anual" });
  }
});

/* ============================================================
   DADOS PARA GRÁFICO
   ============================================================ */
router.get("/grafico/:year", async (req, res) => {
  try {
    const { year } = req.params;

    const remessas = await Remessa.find({ year: Number(year) });

    const meses = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      amount: 0
    }));

    remessas.forEach(r => {
      meses[r.month - 1].amount = r.amount;
    });

    res.json(meses);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dados do gráfico" });
  }
});

module.exports = router;