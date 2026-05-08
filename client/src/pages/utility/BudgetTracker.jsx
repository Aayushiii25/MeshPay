import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

const BudgetTracker = () => {
  const navigate = useNavigate();

  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [inputExpense, setInputExpense] = useState("");
  const [pin, setPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const warnedRef = useRef(false);

  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    "Shopping",
    "Other",
  ];

  // 🔐 VERIFY PIN (SECURE)
  const handlePinSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/verifyPin`,
        { pin },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShowPinModal(false);
    } catch {
      alert("Invalid PIN ❌");
      setPin("");
    }
  };

  // 👤 FETCH USER
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/getUser`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setBudget(Number(res.data.user.budget) || 0);
      setExpenses(Number(res.data.user.expenses) || 0);
    } catch {
      navigate("/login");
    }
  };

  // 📜 FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/getExpenses`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setExpenseList(res.data || []);
    } catch {
      alert("Failed to load expenses ❌");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchExpenses();
  }, []);

  // ➕ ADD EXPENSE
  const handleAddExpense = async () => {
    const amount = Number(inputExpense);

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (!selectedCategory) {
      alert("Select category");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/addExpense`,
        { amount, category: selectedCategory },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setBudget(res.data.updatedUser.budget);
      setExpenses(res.data.updatedUser.expenses);

      await fetchExpenses();

      setInputExpense("");
      setSelectedCategory("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 💰 UPDATE BUDGET
  const handleUpdateBudget = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/updateBudget`,
        { budget },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setBudget(res.data.user.budget);
      setExpenses(res.data.user.expenses);
    } catch {
      alert("Update failed ❌");
    }
  };

  // 📊 FILTER EXPENSES
  const filteredExpenses = expenseList.filter((e) => {
    return new Date(e.date).getMonth() + 1 === Number(selectedMonth);
  });

  const monthlyTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const remaining = budget - monthlyTotal;

  // ⚠️ 90% WARNING
  useEffect(() => {
    if (!warnedRef.current && budget > 0 && expenses >= budget * 0.9) {
      warnedRef.current = true;
      alert("⚠️ 90% budget used");
    }
  }, [expenses, budget]);

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Budget Tracker 💸</h1>

        {/* BUDGET */}
        <div className="mb-6">
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleUpdateBudget}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>

        {/* ADD EXPENSE */}
        <div className="mb-6 flex gap-2">
          <input
            value={inputExpense}
            onChange={(e) => setInputExpense(e.target.value)}
            placeholder="Amount"
            className="p-2 border rounded"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={handleAddExpense}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* FILTER */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mb-4 p-2 border rounded"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        {/* TABLE */}
        <table className="w-full border">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((e) => (
              <tr key={e._id}>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>₹{e.amount}</td>
                <td>{e.category}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SUMMARY */}
        <div className="mt-6 font-bold">
          Total: ₹{monthlyTotal} <br />
          Remaining:{" "}
          <span className={remaining < 0 ? "text-red-500" : "text-green-600"}>
            ₹{remaining}
          </span>
        </div>

        {/* 📊 ANALYTICS */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Spending Insights 📊</h2>

          {categoryData.length === 0 ? (
            <p className="text-gray-500">No data for this month</p>
          ) : (
            <div className="flex flex-col items-center gap-6">
              {/* PIE CHART */}
              <div className="w-[300px] h-[300px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* TOP CATEGORY */}
              {topCategory && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Top Spending</p>
                  <p className="font-bold text-lg">
                    {topCategory.name} 💸 ₹{topCategory.value}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PIN MODAL */}
        {showPinModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50">
            <div className="bg-white p-4 rounded">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                className="border p-2 mb-2"
              />
              <button
                onClick={handlePinSubmit}
                className="bg-green-500 text-white px-4 py-2"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BudgetTracker;
