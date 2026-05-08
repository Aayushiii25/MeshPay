import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import { paymentAPI } from "../../lib/api";
import Navbar from "../../components/navbar/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { ArrowRight, ArrowLeft, Loader, Scan } from "lucide-react";

export default function QrScanner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ receiverUpi: "", amount: "", pin: "" });

  const parseQR = (text) => {
    try {
      const data = JSON.parse(text);
      if (!data.upiId) { toast.error("Invalid QR code"); return; }
      setForm((p) => ({ ...p, receiverUpi: data.upiId }));
      setStep(1);
    } catch {
      toast.error("Invalid QR code");
    }
  };

  const handlePay = async () => {
    if (form.pin.length !== 4) { toast.error("Enter 4-digit PIN"); return; }
    setLoading(true);
    try {
      await paymentAPI.send({ receiverUpi: form.receiverUpi, amount: Number(form.amount), pin: form.pin });
      toast.success("Payment successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-center">
        <div className="modal-content animate-in" style={{ maxWidth: 400 }}>
          {step === 0 && (
            <>
              <h2 className="heading-md text-center" style={{ marginBottom: "1rem" }}>
                <Scan size={20} style={{ verticalAlign: "middle", marginRight: 8 }} /> Scan & Pay
              </h2>
              <div style={{ borderRadius: 16, overflow: "hidden" }}>
                <Scanner onResult={(text) => parseQR(text)} enabled={true} onError={() => {}} />
              </div>
              <p className="text-muted text-sm text-center" style={{ marginTop: "1rem" }}>Point your camera at a MeshPay QR code</p>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="heading-md" style={{ marginBottom: "1rem" }}>Enter Amount</h2>
              <div className="glass-card" style={{ padding: "0.75rem", marginBottom: "1rem" }}>
                <p className="text-muted text-xs">Paying to</p>
                <p style={{ fontWeight: 600 }}>{form.receiverUpi}</p>
              </div>
              <input className="input" type="number" placeholder="₹ 0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} autoFocus style={{ fontSize: "1.25rem", fontWeight: 600 }} />
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button className="btn btn-secondary" onClick={() => setStep(0)}><ArrowLeft size={16} /></button>
                <button className="btn btn-primary btn-full" onClick={() => { if (!form.amount || Number(form.amount) <= 0) { toast.error("Enter amount"); return; } setStep(2); }}>Next <ArrowRight size={16} /></button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="heading-md" style={{ marginBottom: "1rem" }}>Enter PIN</h2>
              <div className="glass-card" style={{ padding: "0.75rem", marginBottom: "1rem" }}>
                <p className="text-muted text-xs">Paying {form.receiverUpi}</p>
                <p className="amount text-accent" style={{ fontSize: "1.25rem" }}>₹{form.amount}</p>
              </div>
              <input className="input input-pin" type="password" maxLength={4} placeholder="••••" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })} autoFocus />
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}><ArrowLeft size={16} /></button>
                <button className="btn btn-primary btn-full" onClick={handlePay} disabled={loading}>
                  {loading ? <Loader size={16} className="spin" /> : "Pay Now"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" } }} />
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
