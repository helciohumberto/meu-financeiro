const mongoose = require("mongoose");

const RemessaSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model("Remessa", RemessaSchema);