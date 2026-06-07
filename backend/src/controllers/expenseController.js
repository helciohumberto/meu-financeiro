const Expense = require("../models/Expense");

module.exports = {
  async list(req, res) {
    try {
      const expenses = await Expense.find()
        .populate("category")
        .sort({ date: -1 });
      res.json(expenses);
    } catch (err) {
      console.error("Erro ao listar despesas:", err);
      res.status(500).json({ error: "Erro ao listar despesas" });
    }
  },

  async create(req, res) {
    try {
      const { description, value, date, category } = req.body;

      if (!description || !description.trim()) {
        return res.status(400).json({ error: "A descrição é obrigatória" });
      }
      if (value == null || isNaN(Number(value)) || Number(value) <= 0) {
        return res
          .status(400)
          .json({ error: "O valor deve ser um número maior que zero" });
      }
      if (!date) {
        return res.status(400).json({ error: "A data é obrigatória" });
      }
      if (!category) {
        return res.status(400).json({ error: "A categoria é obrigatória" });
      }

      const expense = await Expense.create({
        description: description.trim(),
        value: Number(value),
        date,
        category,
      });
      res.status(201).json(expense);
    } catch (err) {
      console.error("Erro ao criar despesa:", err);
      res.status(500).json({ error: "Erro ao criar despesa" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const expense = await Expense.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!expense) {
        return res.status(404).json({ error: "Despesa não encontrada" });
      }
      res.json(expense);
    } catch (err) {
      console.error("Erro ao atualizar despesa:", err);
      res.status(500).json({ error: "Erro ao atualizar despesa" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const expense = await Expense.findByIdAndDelete(id);
      if (!expense) {
        return res.status(404).json({ error: "Despesa não encontrada" });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Erro ao remover despesa:", err);
      res.status(500).json({ error: "Erro ao remover despesa" });
    }
  },

  async bulkCreate(req, res) {
    try {
      const { expenses } = req.body;
      if (!Array.isArray(expenses) || expenses.length === 0) {
        return res.status(400).json({ error: "Lista de despesas vazia" });
      }

      const valid = [];
      const errors = [];

      expenses.forEach((e, i) => {
        const { description, value, date, category } = e;
        const v = Number(value);
        const d = new Date(date);

        if (!description?.trim()) return errors.push({ row: i + 1, reason: "Descrição em falta" });
        if (isNaN(v) || v <= 0) return errors.push({ row: i + 1, reason: "Valor inválido" });
        if (isNaN(d.getTime())) return errors.push({ row: i + 1, reason: "Data inválida" });
        if (!category) return errors.push({ row: i + 1, reason: "Categoria em falta" });

        valid.push({ description: description.trim(), value: v, date: d, category });
      });

      let created = 0;
      if (valid.length > 0) {
        const inserted = await Expense.insertMany(valid, { ordered: false });
        created = inserted.length;
      }

      res.status(201).json({ created, errors });
    } catch (err) {
      console.error("Erro ao importar despesas:", err);
      res.status(500).json({ error: "Erro ao importar despesas" });
    }
  },
};
