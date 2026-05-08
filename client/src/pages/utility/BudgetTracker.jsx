import { useEffect, useState, useMemo, useRef } from "react";
import { budgetAPI } from "../../lib/api";
import { authAPI } from "../../lib/api";
import Navbar from "../../components/navbar/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

const COLORS = ["#00e68a", "#5b8def", "#a78bfa", "#f472b6", "#ffb347", "#22d3ee"];
const CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Other"];

export default function BudgetTracker() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [inputAmount, setInputAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [pin, setPin] = useState("");
  const warnedRef = useRef(false);

  const verifyPin = async () => {
    if (pin.length !== 4) { toast.error("Enter 4-digit PIN"); return; }
    try {
      await authAPI.verifyPin(pin);
      setPinVerified(true);
      fetchData();
    } catch { toast.error("Invalid PIN"); setPin(""); }
  };

  const fetchData = async () => {
    try {
      const [budgetRes, expRes] = await Promise.all([budgetAPI.get(), budgetAPI.getExpenses()]);
      setBudget(budgetRes.data.budget || 0);
      setExpenses(expRes.data || []);
    } catch { toast.error("Failed to load budget data"); }
  };

  const filtered = useMemo(() => expenses.filter((e) => new Date(e.date).getMonth() + 1 === Number(selectedMonth)), [expenses, selectedMonth]);
  const monthlyTotal = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);
  const remaining = budget - monthlyTotal;

  const categoryData = useMemo(() => {
    const map = {};
    filtered.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const topCategory = useMemo(() => categoryData.length ? categoryData.reduce((a, b) => (a.value > b.value ? a : b)) : null, [categoryData]);

  useEffect(() => {
    if (!warnedRef.current && budget > 0 && monthlyTotal >= budget * 0.9) {
      warnedRef.current = true;
      toast("⚠️ You've used 90% of your budget!", { icon: "🔥" });
    }
  }, [monthlyTotal, budget]);

  const handleAdd = async () => {
    if (!inputAmount || Number(inputAmount) <= 0) { toast.error("Enter valid amount"); return; }
    if (!selectedCategory) { toast.error("Select a category"); return; }
    setLoading(true);
    try {
      await budgetAPI.addExpense({ amount: Number(inputAmount), category: selectedCategory });
      setInputAmount(""); setSelectedCategory("");
      await fetchData();
      toast.success("Expense added");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const handleUpdateBudget = async () => {
    try {
      await budgetAPI.update(budget);
      toast.success("Budget updated");
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async (id) => {
    try { await budgetAPI.deleteExpense(id); await fetchData(); toast.success("Deleted"); }
    catch { toast.error("Delete failed"); }
  };

  if (!pinVerified) {
    return (
      <>
        <Navbar />
        <div className="page-center">
          <div className="modal-content animate-in text-center" style={{ maxWidth: 380 }}>
            <h2 className="heading-md">Enter PIN</h2>
            <p className="text-muted text-sm" style={{ margin: "0.5rem 0 1.5rem" }}>Verify identity to access budget</p>
            <input className="input input-pin" type="password" maxLength={4} placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} autoFocus />
            <button className="btn btn-primary btn-full" style={{ marginTop: "1rem" }} onClick={verifyPin}>Verify</button>
          </div>
        </div>
        <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" } }} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page"><div className="container" style={{ maxWidth: 900 }}>
        <h1 className="heading-lg" style={{ marginBottom: "1.5rem" }}>Budget Tracker</h1>

        {/* Budget + Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <p className="text-muted text-sm">Monthly Budget</p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <input className="input" type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={handleUpdateBudget}>Set</button>
            </div>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <p className="text-muted text-sm">Spent</p>
            <p className="amount amount-debit" style={{ fontSize: "1.5rem" }}>₹{monthlyTotal.toLocaleString()}</p>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <p className="text-muted text-sm">Remaining</p>
            <p className={`amount ${remaining < 0 ? "amount-debit" : "amount-credit"}`} style={{ fontSize: "1.5rem" }}>₹{remaining.toLocaleString()}</p>
            {remaining < 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}><AlertTriangle size={14} color="var(--error)" /><span className="text-xs" style={{ color: "var(--error)" }}>Over budget</span></div>}
          </div>
        </div>

        {/* Add Expense */}
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "2rem" }}>
          <p className="heading-sm" style={{ marginBottom: "0.75rem" }}>Add Expense</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input className="input" placeholder="Amount" type="number" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} style={{ flex: "1 1 120px" }} />
            <select className="input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ flex: "1 1 150px" }}>
              <option value="">Category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary" onClick={handleAdd} disabled={loading}><Plus size={16} /> {loading ? "Adding..." : "Add"}</button>
          </div>
        </div>

        {/* Month Filter */}
        <div style={{ marginBottom: "1.5rem" }}>
          <select className="input" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ maxWidth: 200 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Chart */}
          {categoryData.length > 0 && (
            <div className="glass-card" style={{ padding: "1.25rem" }}>
              <p className="heading-sm" style={{ marginBottom: "0.75rem" }}>Spending Breakdown</p>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {topCategory && <p className="text-sm text-muted text-center" style={{ marginTop: "0.5rem" }}>Top: <strong style={{ color: "var(--text-primary)" }}>{topCategory.name}</strong> — ₹{topCategory.value}</p>}
            </div>
          )}

          {/* Expense List */}
          <div className="glass-card" style={{ padding: "1.25rem", maxHeight: 400, overflowY: "auto" }}>
            <p className="heading-sm" style={{ marginBottom: "0.75rem" }}>Expenses</p>
            {filtered.length === 0 ? <p className="text-muted text-sm">No expenses this month</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {filtered.map((e) => (
                  <div key={e._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>₹{e.amount}</p>
                      <p className="text-muted text-xs">{e.category} · {new Date(e.date).toLocaleDateString()}</p>
                    </div>
                    <button className="btn btn-ghost" onClick={() => handleDelete(e._id)} style={{ padding: "0.375rem", color: "var(--text-muted)" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div></main>
      <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" } }} />
    </>
  );
}
