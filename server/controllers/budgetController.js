const Budget = require("../models/Budget");
const { asyncHandler } = require("../middleware/errorHandler");

const updateBudget = asyncHandler(async (req, res) => {
  const { budget } = req.body;
  if (budget === undefined || isNaN(budget) || budget < 0) {
    return res.status(400).json({ message: "Valid budget amount required" });
  }
  let budgetDoc = await Budget.findOne({ userId: req.userId });
  if (!budgetDoc) { budgetDoc = new Budget({ userId: req.userId, budget: Number(budget) }); }
  else { budgetDoc.budget = Number(budget); }
  await budgetDoc.save();
  res.status(200).json({ message: "Budget updated", budget: budgetDoc.budget, expenses: budgetDoc.expenses, remaining: budgetDoc.budget - budgetDoc.expenses });
});

const getBudget = asyncHandler(async (req, res) => {
  let budgetDoc = await Budget.findOne({ userId: req.userId });
  if (!budgetDoc) { budgetDoc = new Budget({ userId: req.userId }); await budgetDoc.save(); }
  res.status(200).json({ budget: budgetDoc.budget, expenses: budgetDoc.expenses, remaining: budgetDoc.budget - budgetDoc.expenses, categories: budgetDoc.categories });
});

const addExpense = asyncHandler(async (req, res) => {
  const { amount, category } = req.body;
  if (!amount || isNaN(amount) || Number(amount) <= 0) return res.status(400).json({ message: "Valid amount required" });
  if (!category) return res.status(400).json({ message: "Category is required" });

  let budgetDoc = await Budget.findOne({ userId: req.userId });
  if (!budgetDoc) {
    budgetDoc = new Budget({ userId: req.userId, categories: [
      { name: "Food", value: 0 }, { name: "Transport", value: 0 }, { name: "Entertainment", value: 0 },
      { name: "Utilities", value: 0 }, { name: "Shopping", value: 0 }, { name: "Other", value: 0 },
    ]});
  }
  const expenseAmount = Number(amount);
  budgetDoc.expensesList.push({ amount: expenseAmount, category, date: new Date() });
  budgetDoc.expenses += expenseAmount;
  const catIdx = budgetDoc.categories.findIndex((c) => c.name === category);
  if (catIdx !== -1) { budgetDoc.categories[catIdx].value += expenseAmount; }
  else { budgetDoc.categories.push({ name: category, value: expenseAmount }); }
  await budgetDoc.save();
  res.status(200).json({ message: "Expense added", budget: budgetDoc.budget, expenses: budgetDoc.expenses, remaining: budgetDoc.budget - budgetDoc.expenses, categories: budgetDoc.categories });
});

const getExpenses = asyncHandler(async (req, res) => {
  const budgetDoc = await Budget.findOne({ userId: req.userId });
  if (!budgetDoc) return res.status(200).json([]);
  res.status(200).json(budgetDoc.expensesList);
});

const editExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, category } = req.body;
  if (!amount || isNaN(amount)) return res.status(400).json({ message: "Valid amount required" });
  if (!category) return res.status(400).json({ message: "Category is required" });
  const budgetDoc = await Budget.findOne({ userId: req.userId });
  if (!budgetDoc) return res.status(404).json({ message: "Budget not found" });
  const expIdx = budgetDoc.expensesList.findIndex((e) => e._id.toString() === id);
  if (expIdx === -1) return res.status(404).json({ message: "Expense not found" });
  const oldExpense = budgetDoc.expensesList[expIdx];
  const newAmount = Number(amount);
  const diff = newAmount - oldExpense.amount;
  const oldCatIdx = budgetDoc.categories.findIndex((c) => c.name === oldExpense.category);
  if (oldCatIdx !== -1) budgetDoc.categories[oldCatIdx].value -= oldExpense.amount;
  const newCatIdx = budgetDoc.categories.findIndex((c) => c.name === category);
  if (newCatIdx !== -1) { budgetDoc.categories[newCatIdx].value += newAmount; }
  else { budgetDoc.categories.push({ name: category, value: newAmount }); }
  budgetDoc.expensesList[expIdx].amount = newAmount;
  budgetDoc.expensesList[expIdx].category = category;
  budgetDoc.expenses += diff;
  await budgetDoc.save();
  res.status(200).json({ message: "Expense updated", expenses: budgetDoc.expenses, categories: budgetDoc.categories });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const budgetDoc = await Budget.findOne({ userId: req.userId });
  if (!budgetDoc) return res.status(404).json({ message: "Budget not found" });
  const expIdx = budgetDoc.expensesList.findIndex((e) => e._id.toString() === id);
  if (expIdx === -1) return res.status(404).json({ message: "Expense not found" });
  const deleted = budgetDoc.expensesList[expIdx];
  budgetDoc.expensesList.splice(expIdx, 1);
  budgetDoc.expenses -= deleted.amount;
  const catIdx = budgetDoc.categories.findIndex((c) => c.name === deleted.category);
  if (catIdx !== -1) { budgetDoc.categories[catIdx].value -= deleted.amount; if (budgetDoc.categories[catIdx].value <= 0) budgetDoc.categories.splice(catIdx, 1); }
  await budgetDoc.save();
  res.status(200).json({ message: "Expense deleted", expenses: budgetDoc.expenses, categories: budgetDoc.categories });
});

module.exports = { updateBudget, getBudget, addExpense, getExpenses, editExpense, deleteExpense };
