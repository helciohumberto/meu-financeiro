const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  monthlyGoal: { type: Number, default: 1200 },
  salary: { type: Number, default: 0 }
});

module.exports = mongoose.model("Settings", SettingsSchema);