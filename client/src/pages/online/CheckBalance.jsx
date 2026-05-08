import { useState } from "react";
import { paymentAPI } from "../../lib/api";
import Navbar from "../../components/navbar/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { Eye, Loader } from "lucide-react";

export default function CheckBalance() {
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (pin.length !== 4) { toast.error("Enter 4-digit PIN"); return; }
    setLoading(true);
    try {
      const { data } = await paymentAPI.checkBalance(pin);
      setBalance(data.balance);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to check balance");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-center">
        <div className="modal-content animate-in text-center" style={{ maxWidth: 380 }}>
          {balance !== null ? (
            <>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <Eye size={28} style={{ color: "var(--accent)" }} />
              </div>
              <p className="text-muted text-sm">Available Balance</p>
              <p className="amount" style={{ fontSize: "2.5rem", color: "var(--accent)", margin: "0.5rem 0 2rem" }}>₹{balance?.toLocaleString("en-IN")}</p>
              <button className="btn btn-secondary btn-full" onClick={() => { setBalance(null); setPin(""); }}>Hide Balance</button>
            </>
          ) : (
            <>
              <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>Check Balance</h2>
              <p className="text-muted text-sm" style={{ marginBottom: "1.5rem" }}>Enter your PIN to view balance</p>
              <input className="input input-pin" type="password" maxLength={4} placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} autoFocus />
              <button className="btn btn-primary btn-full" style={{ marginTop: "1rem" }} onClick={handleSubmit} disabled={loading}>
                {loading ? <><Loader size={16} className="spin" /> Checking...</> : "View Balance"}
              </button>
            </>
          )}
        </div>
      </div>
      <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" } }} />
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
