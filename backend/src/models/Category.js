const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: "#1976d2" },
  icon: { type: String, default: "Category" }
});

module.exports = mongoose.model("Category", CategorySchema);