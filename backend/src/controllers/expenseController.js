const Expense = require("../models/Expense");

module.exports = {
  async list(req, res) {
    const expenses = await Expense.find().populate("category").sort({ date: -1 });
    res.json(expenses);
  },

  async create(req, res) {
    const expense = await Expense.create(req.body);
    res.json(expense);
  },

  async update(req, res) {
    const { id } = req.params;
    const expense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    res.json(expense);
  },

  async remove(req, res) {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.json({ success: true });
  }
};