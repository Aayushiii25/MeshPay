const express = require("express");
const {
  updateBudget,
  getBudget,
  addExpense,
  getExpenses,
  editExpense,
  deleteExpense,
} = require("../controllers/budgetController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getBudget);
router.post("/update", auth, updateBudget);
router.post("/expense", auth, addExpense);
router.get("/expenses", auth, getExpenses);
router.put("/expense/:id", auth, editExpense);
router.delete("/expense/:id", auth, deleteExpense);

module.exports = router;
