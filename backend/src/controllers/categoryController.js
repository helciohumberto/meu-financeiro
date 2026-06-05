const Category = require("../models/Category");

module.exports = {
  async list(req, res) {
    try {
      const categories = await Category.find().sort({ name: 1 });
      res.json(categories);
    } catch (err) {
      console.error("Erro ao listar categorias:", err);
      res.status(500).json({ error: "Erro ao listar categorias" });
    }
  },

  async create(req, res) {
    try {
      const { name, color, icon } = req.body;

      if (!name || !name.trim()) {
        return res
          .status(400)
          .json({ error: "O nome da categoria é obrigatório" });
      }

      const category = await Category.create({
        name: name.trim(),
        color,
        icon,
      });
      res.status(201).json(category);
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
      res.status(500).json({ error: "Erro ao criar categoria" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }
      res.json(category);
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err);
      res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Erro ao remover categoria:", err);
      res.status(500).json({ error: "Erro ao remover categoria" });
    }
  },
};
