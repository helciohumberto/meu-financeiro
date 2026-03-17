const Settings = require("../models/Settings");

module.exports = {
  async get(req, res) {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        monthlyGoal: 1200,
        salary: 0
      });
    }

    res.json(settings);
  },

  async update(req, res) {
    const { monthlyGoal, salary } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({ monthlyGoal, salary });
    } else {
      settings.monthlyGoal = monthlyGoal;
      settings.salary = salary;
      await settings.save();
    }

    res.json(settings);
  }
};