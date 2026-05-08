import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { paymentAPI } from "../../lib/api";
import Navbar from "../../components/navbar/Navbar";
import { ArrowRight, ArrowLeft, Check, Loader } from "lucide-react";

export default function PayUPI() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ receiverUpi: "", amount: "", pin: "" });

  const validateUPI = (upi) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upi);

  const next = () => {
    if (step === 1) {
      if (!form.receiverUpi || !validateUPI(form.receiverUpi)) { toast.error("Enter a valid UPI ID"); return; }
      setStep(2);
    } else if (step === 2) {
      if (!form.amount || Number(form.amount) <= 0) { toast.error("Enter a valid amount"); return; }
      setStep(3);
    }
  };

  const handlePay = async () => {
    if (form.pin.length !== 4) { toast.error("Enter 4-digit PIN"); return; }
    setLoading(true);
    try {
      const { data } = await paymentAPI.send({
        receiverUpi: form.receiverUpi,
        amount: Number(form.amount),
        pin: form.pin,
      });
      setResult({ success: true, ref: data.referenceNumber });
    } catch (err) {
      setResult({ success: false, msg: err.response?.data?.message || "Payment failed" });
    } finally {
      setLoading(false);
    }
  };

  const titles = ["", "Recipient", "Amount", "Confirm"];

  if (result) {
    return (
      <>
        <Navbar />
        <div className="page-center">
          <div className="modal-content text-center animate-in" style={{ maxWidth: 380 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: result.success ? "var(--accent-dim)" : "rgba(255,77,106,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <Check size={28} style={{ color: result.success ? "var(--accent)" : "var(--error)" }} />
            </div>
            <h2 className="heading-md">{result.success ? "Payment Sent!" : "Payment Failed"}</h2>
            <p className="text-muted" style={{ margin: "0.75rem 0 1.5rem" }}>
              {result.success ? `₹${form.amount} sent to ${form.receiverUpi}` : result.msg}
            </p>
            {result.success && <p className="text-xs text-muted">Ref: {result.ref}</p>}
            <button className="btn btn-primary btn-full" style={{ marginTop: "1.5rem" }} onClick={() => navigate("/")}>Done</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-center">
        <div className="modal-content animate-in" style={{ maxWidth: 400 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? "var(--accent)" : "var(--bg-elevated)" }} />
            ))}
          </div>
          <h2 className="heading-md" style={{ marginBottom: "1.5rem" }}>{titles[step]}</h2>

          {step === 1 && (
            <div className="input-group">
              <label className="input-label">UPI ID</label>
              <input className="input" placeholder="name@meshpay" value={form.receiverUpi} onChange={(e) => setForm({ ...form, receiverUpi: e.target.value })} autoFocus />
            </div>
          )}
          {step === 2 && (
            <div className="input-group">
              <label className="input-label">Amount (₹)</label>
              <input className="input" type="number" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} autoFocus style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)" }} />
            </div>
          )}
          {step === 3 && (
            <>
              <div className="glass-card" style={{ padding: "1rem", marginBottom: "1rem" }}>
                <p className="text-muted text-sm">Sending to</p>
                <p style={{ fontWeight: 600 }}>{form.receiverUpi}</p>
                <p className="amount" style={{ fontSize: "1.5rem", color: "var(--accent)", marginTop: "0.5rem" }}>₹{form.amount}</p>
              </div>
              <div className="input-group">
                <label className="input-label">Enter PIN</label>
                <input className="input input-pin" type="password" maxLength={4} placeholder="••••" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })} autoFocus />
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Back</button>}
            {step < 3 ? (
              <button className="btn btn-primary btn-full" onClick={next}>Next <ArrowRight size={16} /></button>
            ) : (
              <button className="btn btn-primary btn-full" onClick={handlePay} disabled={loading}>
                {loading ? <><Loader size={16} className="spin" /> Processing...</> : "Pay Now"}
              </button>
            )}
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" } }} />
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
