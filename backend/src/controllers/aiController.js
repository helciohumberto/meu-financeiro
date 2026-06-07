const OpenAI = require("openai");
const Category = require("../models/Category");
const Expense = require("../models/Expense");
const Remessa = require("../models/Remessa");
const Settings = require("../models/Settings");

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

module.exports = {
  async suggestCategory(req, res) {
    try {
      const client = getClient();
      if (!client) return res.status(503).json({ error: "OPENAI_API_KEY não configurada" });

      const { description } = req.body;
      if (!description?.trim()) return res.status(400).json({ error: "Descrição obrigatória" });

      const categories = await Category.find({}, "name _id");
      if (!categories.length) return res.json({ categoryId: null, categoryName: null });

      const names = categories.map((c) => c.name).join(", ");

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 64,
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "És um assistente de categorização de despesas. Responds APENAS com o nome exacto de uma das categorias fornecidas. Sem pontuação, sem explicação.",
          },
          {
            role: "user",
            content: `Despesa: "${description.trim()}"\nCategorias: ${names}\nCategoria mais adequada:`,
          },
        ],
      });

      const suggested = completion.choices[0].message.content.trim();
      const match = categories.find(
        (c) => c.name.toLowerCase() === suggested.toLowerCase()
      );

      res.json({ categoryId: match?._id ?? null, categoryName: match?.name ?? suggested });
    } catch (err) {
      console.error("Erro IA suggestCategory:", err.message);
      res.status(500).json({ error: "Erro ao sugerir categoria" });
    }
  },

  async insights(req, res) {
    try {
      const client = getClient();
      if (!client) return res.status(503).json({ error: "OPENAI_API_KEY não configurada" });

      const { month, year } = req.query;
      const now = new Date();
      const selectedMonth = month ? Number(month) - 1 : now.getMonth();
      const selectedYear = year ? Number(year) : now.getFullYear();

      const firstDay = new Date(selectedYear, selectedMonth, 1);
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0);

      const [totalResult, byCategory, remessa, settings] = await Promise.all([
        Expense.aggregate([
          { $match: { date: { $gte: firstDay, $lte: lastDay } } },
          { $group: { _id: null, total: { $sum: "$value" } } },
        ]),
        Expense.aggregate([
          { $match: { date: { $gte: firstDay, $lte: lastDay } } },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "cat",
            },
          },
          { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: { $ifNull: ["$cat.name", "Sem categoria"] },
              total: { $sum: "$value" },
            },
          },
          { $sort: { total: -1 } },
        ]),
        Remessa.findOne({ month: selectedMonth + 1, year: selectedYear }),
        Settings.findOne(),
      ]);

      const total = totalResult[0]?.total ?? 0;
      const goal = settings?.monthlyGoal ?? 1200;
      const salary = settings?.salary ?? 0;
      const remessaAmount = remessa?.amount ?? 0;

      const monthLabel = `${MONTHS_PT[selectedMonth]} ${selectedYear}`;
      const overGoal = total > goal;

      const catLines = byCategory
        .map((c) => `  ${c._id}: €${c.total.toFixed(2)}`)
        .join("\n");

      const prompt = `Dados financeiros — ${monthLabel}:
- Salário: €${salary.toFixed(2)}
- Total gasto: €${total.toFixed(2)}
- Meta mensal: €${goal.toFixed(2)} ${overGoal ? "(ULTRAPASSADA em €" + (total - goal).toFixed(2) + ")" : "(dentro do limite)"}
- Enviado para o Brasil: €${remessaAmount.toFixed(2)}
- Despesas por categoria:
${catLines || "  (sem despesas)"}

Gera 2 a 3 insights financeiros concisos sobre estes dados. Cada insight numa linha. Sem bullets, sem títulos. Fala directamente ao utilizador usando "tu".`;

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content:
              "És um assistente financeiro pessoal. Respondes em português europeu, de forma directa, concisa e útil.",
          },
          { role: "user", content: prompt },
        ],
      });

      res.json({ insights: completion.choices[0].message.content });
    } catch (err) {
      console.error("Erro IA insights:", err.message);
      res.status(500).json({ error: "Erro ao gerar insights" });
    }
  },

  async chat(req, res) {
    try {
      const client = getClient();
      if (!client) return res.status(503).json({ error: "OPENAI_API_KEY não configurada" });

      const { messages: history } = req.body;
      if (!Array.isArray(history) || !history.length) {
        return res.status(400).json({ error: "Histórico de mensagens obrigatório" });
      }

      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

      const [byCategory, remessas, settings] = await Promise.all([
        Expense.aggregate([
          { $match: { date: { $gte: sixMonthsAgo } } },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "cat",
            },
          },
          { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
                cat: { $ifNull: ["$cat.name", "Sem categoria"] },
              },
              total: { $sum: "$value" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
        Remessa.find({ year: { $gte: now.getFullYear() - 1 } }).lean(),
        Settings.findOne().lean(),
      ]);

      const goal = settings?.monthlyGoal ?? 1200;
      const salary = settings?.salary ?? 0;

      const context = `Dados do utilizador (últimos 6 meses):
- Salário mensal: €${salary}
- Meta mensal de despesas: €${goal}
- Despesas por categoria/mês: ${JSON.stringify(
        byCategory.map((b) => ({
          ano: b._id.year,
          mes: b._id.month,
          categoria: b._id.cat,
          total: b.total.toFixed(2),
        }))
      )}
- Remessas para o Brasil: ${JSON.stringify(
        remessas.map((r) => ({ mes: r.month, ano: r.year, valor: r.amount }))
      )}
- Hoje: ${now.toLocaleDateString("pt-PT")}`;

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 512,
        messages: [
          {
            role: "system",
            content: `És um assistente financeiro pessoal. Respondes em português europeu, de forma concisa e útil. Tens acesso aos dados financeiros do utilizador:\n\n${context}`,
          },
          ...history,
        ],
      });

      res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
      console.error("Erro IA chat:", err.message);
      res.status(500).json({ error: "Erro no assistente IA" });
    }
  },
};
