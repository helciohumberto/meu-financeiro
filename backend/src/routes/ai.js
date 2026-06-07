const router = require("express").Router();
const { suggestCategory, insights, chat } = require("../controllers/aiController");

router.post("/suggest-category", suggestCategory);
router.get("/insights", insights);
router.post("/chat", chat);

module.exports = router;
