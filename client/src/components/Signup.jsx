import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ userName: "", fullName: "", email: "", pin: "", phoneNo: "", password: "" });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.pin.length !== 4 || isNaN(form.pin)) { toast.error("PIN must be 4 digits"); return; }
    if (form.phoneNo.length !== 10 || isNaN(form.phoneNo)) { toast.error("Phone must be 10 digits"); return; }
    if (form.password.length < 6) { toast.error("Password must be 6+ characters"); return; }

    setLoading(true);
    try {
      await register({ ...form, pin: Number(form.pin), phoneNo: form.phoneNo });
      toast.success("Account created!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "userName", label: "Username", placeholder: "Choose a username", type: "text" },
    { name: "fullName", label: "Full Name", placeholder: "Your full name", type: "text" },
    { name: "email", label: "Email", placeholder: "you@email.com", type: "email" },
    { name: "phoneNo", label: "Phone Number", placeholder: "10-digit number", type: "tel" },
    { name: "pin", label: "4-Digit PIN", placeholder: "••••", type: "password" },
  ];

  return (
    <div className="page-center" style={{ background: "var(--bg-primary)" }}>
      <div className="auth-container animate-in">
        <div className="auth-header">
          <div className="brand-icon" style={{ width: 48, height: 48, fontSize: "1.25rem", borderRadius: 12 }}>M</div>
          <h1 className="heading-lg" style={{ marginTop: "1.25rem" }}>Create account</h1>
          <p className="text-muted" style={{ marginTop: "0.5rem" }}>Join MeshPay and start transacting</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {fields.map((f) => (
            <div className="input-group" key={f.name}>
              <label className="input-label">{f.label}</label>
              <input name={f.name} type={f.type} className="input" placeholder={f.placeholder} required value={form[f.name]} onChange={update} />
            </div>
          ))}

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} name="password" className="input" placeholder="Min 6 characters" required value={form.password} onChange={update} style={{ paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                {showPw ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? "Creating..." : "Create Account"} {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
      </div>
      <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" } }} />
    </div>
  );
}
