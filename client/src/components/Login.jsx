import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(userName, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center" style={{ background: "var(--bg-primary)" }}>
      <div className="auth-container animate-in">
        <div className="auth-header">
          <div className="brand-icon" style={{ width: 48, height: 48, fontSize: "1.25rem", borderRadius: 12 }}>M</div>
          <h1 className="heading-lg" style={{ marginTop: "1.25rem" }}>Welcome back</h1>
          <p className="text-muted" style={{ marginTop: "0.5rem" }}>Sign in to your MeshPay account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Username</label>
            <input ref={inputRef} className="input" placeholder="Enter your username" required value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} className="input" placeholder="Enter password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                {showPw ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"} {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </div>
      <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" } }} />
    </div>
  );
}
