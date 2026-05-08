const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userDatas",
      required: true,
      unique: true,
      index: true,
    },
    budget: {
      type: Number,
      default: 0,
      min: [0, "Budget cannot be negative"],
    },
    expenses: {
      type: Number,
      default: 0,
    },
    categories: [
      {
        name: { type: String, required: true },
        value: { type: Number, default: 0 },
      },
    ],
    expensesList: [
      {
        amount: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
