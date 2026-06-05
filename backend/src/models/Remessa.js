const mongoose = require("mongoose");

const RemessaSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  // Cotação EUR -> BRL registrada no momento do envio (opcional p/ remessas antigas)
  rate: { type: Number, default: null }
});

module.exports = mongoose.model("Remessa", RemessaSchema);