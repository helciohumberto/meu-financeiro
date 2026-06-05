const express = require("express");
const Remessa = require("../models/Remessa");

const router = express.Router();

/* ============================================================
   REGISTRAR REMESSA (CRIAR OU ATUALIZAR)

   O saldo (cash) é calculado dinamicamente pelo dashboard
   (salary - despesas do mês - remessa do mês), portanto aqui
   apenas persistimos a remessa — sem manter um saldo paralelo.
   ============================================================ */
router.post("/", async (req, res) => {
  try {
    const { month, year, amount, rate } = req.body;

    // Verifica se já existe remessa no mês (uma remessa por mês/ano)
    const existente = await Remessa.findOne({ month, year });

    if (existente) {
      existente.amount = amount;
      if (rate != null) existente.rate = rate;
      await existente.save();

      return res.json({
        message: "Remessa atualizada",
        remessa: existente
      });
    }

    const remessa = await Remessa.create({ month, year, amount, rate });

    res.json({
      message: "Remessa registrada",
      remessa
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
    const { amount, month, year, rate } = req.body;

    const remessa = await Remessa.findById(req.params.id);
    if (!remessa) {
      return res.status(404).json({ error: "Remessa não encontrada" });
    }

    remessa.amount = amount;
    remessa.month = month;
    remessa.year = year;
    if (rate != null) remessa.rate = rate;
    await remessa.save();

    res.json({
      message: "Remessa atualizada com sucesso",
      remessa
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

    await remessa.deleteOne();

    res.json({
      message: "Remessa deletada"
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