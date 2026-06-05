const express = require("express");
const router = express.Router();

const categories = require("./categories");
const expenses = require("./expenses");
const reports = require("./reports");

router.use("/settings", require("./settings"));
router.use("/categories", categories);
router.use("/expenses", expenses);
router.use("/reports", reports);
router.use("/exchange", require("./exchange"));

module.exports = router;