const express = require("express");
const axios = require("axios");

const router = express.Router();

// Cache simples em memória para não consultar a API a cada request.
let cache = { data: null, ts: 0 };
const TTL = 1000 * 60 * 30; // 30 minutos

/* ============================================================
   COTAÇÃO EUR -> BRL
   Normaliza para { base, date, rates: { BRL } } — formato que
   o frontend já espera (exchange.rates.BRL).
   ============================================================ */
router.get("/", async (req, res) => {
  try {
    if (cache.data && Date.now() - cache.ts < TTL) {
      return res.json(cache.data);
    }

    const { data } = await axios.get(
      "https://economia.awesomeapi.com.br/json/last/EUR-BRL",
      { timeout: 8000 }
    );

    const rate = Number(data?.EURBRL?.bid);
    if (!rate || isNaN(rate)) {
      throw new Error("Cotação indisponível");
    }

    const payload = {
      base: "EUR",
      date: new Date().toISOString(),
      rates: { BRL: rate },
    };

    cache = { data: payload, ts: Date.now() };
    res.json(payload);
  } catch (err) {
    console.error("Erro ao obter câmbio:", err.message);
    // Em caso de falha, devolve a última cotação conhecida, se houver.
    if (cache.data) return res.json(cache.data);
    res.status(502).json({ error: "Não foi possível obter a cotação" });
  }
});

module.exports = router;
