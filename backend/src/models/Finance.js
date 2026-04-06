const mongoose = require("mongoose");

const FinanceSchema = new mongoose.Schema({
  cash: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Finance", FinanceSchema);