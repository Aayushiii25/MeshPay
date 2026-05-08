import { useState, useEffect, useMemo } from "react";
import { paymentAPI } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import { RefreshCw, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function Transaction() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const transactions = useMemo(() => {
    return [...(user?.transactions || [])].reverse();
  }, [user]);

  useEffect(() => { setLoading(false); }, []);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchFilter = filter === "All" || t.type === filter;
      const matchSearch = !search || t.upiId?.toLowerCase().includes(search.toLowerCase()) || t.referenceNumber?.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [transactions, search, filter]);

  const formatDate = (d) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h1 className="heading-lg">Transactions</h1>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="input" placeholder="Search UPI or reference..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "2.5rem" }} />
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["All", "Debit", "Credit"].map((f) => (
                <button key={f} className={`btn ${filter === f ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(f)} style={{ padding: "0.5rem 1rem", fontSize: "0.8125rem" }}>{f}</button>
              ))}
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 80 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center" style={{ padding: "4rem 0" }}>
              <p className="text-muted">No transactions found</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {filtered.map((txn) => {
                const isDebit = txn.type === "Debit";
                return (
                  <div key={txn._id} className="glass-card animate-in" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: isDebit ? "rgba(255,77,106,0.1)" : "rgba(0,230,138,0.1)", color: isDebit ? "var(--error)" : "var(--success)" }}>
                        {isDebit ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{txn.upiId}</p>
                        <p className="text-muted text-xs">{formatDate(txn.date)} · {txn.referenceNumber}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p className={`amount ${isDebit ? "amount-debit" : "amount-credit"}`} style={{ fontSize: "1.0625rem" }}>
                        {isDebit ? "-" : "+"}₹{txn.amount}
                      </p>
                      <span className={`badge ${isDebit ? "badge-error" : "badge-success"}`}>{txn.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
