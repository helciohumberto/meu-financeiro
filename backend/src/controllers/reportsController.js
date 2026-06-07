const Expense = require("../models/Expense");
const Category = require("../models/Category");
const Settings = require("../models/Settings");
const Remessa = require("../models/Remessa");

module.exports = {
  async dashboard(req, res) {
    try {
      const { month, year, category } = req.query;

      const now = new Date();
      const selectedMonth = month ? Number(month) - 1 : now.getMonth();
      const selectedYear = year ? Number(year) : now.getFullYear();

      const firstDay = new Date(selectedYear, selectedMonth, 1);
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0);

      const matchFilter = {
        date: { $gte: firstDay, $lte: lastDay }
      };

      if (category) {
        matchFilter.category = category;
      }

      const totalMonth = await Expense.aggregate([
        { $match: matchFilter },
        { $group: { _id: null, total: { $sum: "$value" } } }
      ]);

      const total = totalMonth[0]?.total || 0;
      const expenseCount = await Expense.countDocuments(matchFilter);

      const byCategory = await Expense.aggregate([
        { $match: matchFilter },
        { $group: { _id: "$category", value: { $sum: "$value" } } },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: "$category" },
        {
          $project: {
            _id: 0,
            category: "$category.name",
            color: "$category.color",
            value: 1
          }
        }
      ]);

      const monthly = await Expense.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" }
            },
            value: { $sum: "$value" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                {
                  $arrayElemAt: [
                    ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                    { $subtract: ["$_id.month", 1] }
                  ]
                },
                " ",
                { $toString: "$_id.year" }
              ]
            },
            value: 1
          }
        }
      ]);

      let settings = await Settings.findOne();

      if (!settings) {
        settings = await Settings.create({ monthlyGoal: 1200, salary: 0 });
      }

      const goal = settings?.monthlyGoal ?? 1200;
      const salary = settings?.salary ?? 0;

      const remessaMes = await Remessa.findOne({
        month: selectedMonth + 1,
        year: selectedYear
      });

      const totalEnviadoMes = remessaMes ? remessaMes.amount : 0;

      const remessasAno = await Remessa.find({ year: selectedYear });
      const totalEnviadoAno = remessasAno.reduce((sum, r) => sum + (r.amount || 0), 0);

      const cash = salary - total - totalEnviadoMes;

      res.json({
        totalMonth: total,
        goal,
        remaining: goal - total,
        salary,
        cash,
        byCategory,
        monthly,
        totalEnviadoMes,
        totalEnviadoAno,
        expenseCount
      });

    } catch (err) {
      console.error("Erro no dashboard:", err);
      res.status(500).json({ error: "Erro ao gerar dashboard" });
    }
  },

  async daily(req, res) {
    try {
      const { month, year } = req.query;
      const now = new Date();
      const selectedMonth = month ? Number(month) - 1 : now.getMonth();
      const selectedYear = year ? Number(year) : now.getFullYear();

      const firstDay = new Date(selectedYear, selectedMonth, 1);
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
      const daysInMonth = lastDay.getDate();

      const dailyTotals = await Expense.aggregate([
        { $match: { date: { $gte: firstDay, $lte: lastDay } } },
        { $group: { _id: { $dayOfMonth: "$date" }, total: { $sum: "$value" } } },
        { $sort: { _id: 1 } }
      ]);

      const settings = await Settings.findOne();
      const goal = settings?.monthlyGoal ?? 1200;

      const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const found = dailyTotals.find(d => d._id === day);
        return { day, total: found ? found.total : 0 };
      });

      res.json({ days, goal });
    } catch (err) {
      console.error("Erro no acumulado diário:", err);
      res.status(500).json({ error: "Erro ao gerar acumulado diário" });
    }
  }
};
