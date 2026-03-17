const Category = require("../models/Category");

module.exports = {
  async list(req, res) {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  },

  async create(req, res) {
    const category = await Category.create(req.body);
    res.json(category);
  },

  async update(req, res) {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.json(category);
  },

  async remove(req, res) {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ success: true });
  }
};