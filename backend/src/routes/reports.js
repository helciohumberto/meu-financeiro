const express = require("express");
const router = express.Router();
const controller = require("../controllers/reportsController");

router.get("/dashboard", controller.dashboard);
router.get("/daily", controller.daily);

module.exports = router;