import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";
import {
  CreditCard, QrCode, Wallet, PieChart, StickyNote,
  ArrowUpRight, ArrowDownLeft, Scan, WifiOff
} from "lucide-react";

const features = [
  { title: "Send Money", desc: "Pay via UPI instantly", icon: <ArrowUpRight size={24} />, path: "/pay", accent: "#00e68a" },
  { title: "Scan & Pay", desc: "Scan QR to pay", icon: <Scan size={24} />, path: "/qrscanner", accent: "#5b8def" },
  { title: "Receive", desc: "Show your QR code", icon: <ArrowDownLeft size={24} />, path: "/qr", accent: "#a78bfa" },
  { title: "Balance", desc: "Check your balance", icon: <Wallet size={24} />, path: "/balance", accent: "#ffb347" },
  { title: "History", desc: "View transactions", icon: <CreditCard size={24} />, path: "/transactions", accent: "#f472b6" },
  { title: "Budget", desc: "Track spending", icon: <PieChart size={24} />, path: "/budget", accent: "#22d3ee" },
  { title: "Notes", desc: "Quick notes", icon: <StickyNote size={24} />, path: "/notes", accent: "#fbbf24" },
  { title: "Offline", desc: "Pay without internet", icon: <WifiOff size={24} />, path: "/offline", accent: "#818cf8" },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="container">
          {/* Hero */}
          <section className="dash-hero animate-in">
            <p className="text-muted text-sm">Welcome back</p>
            <h1 className="heading-xl" style={{ marginTop: "0.25rem" }}>
              {user?.fullName || user?.userName}
            </h1>
            <p className="text-muted" style={{ marginTop: "0.5rem" }}>
              UPI: <span className="text-accent">{user?.upiId}</span>
            </p>
          </section>

          {/* Feature Grid */}
          <section className="dash-grid">
            {features.map((f, i) => (
              <Link to={f.path} key={f.path} className={`dash-card glass-card glass-card--accent animate-in stagger-${Math.min(i + 1, 4)}`}>
                <div className="dash-card-icon" style={{ background: `${f.accent}15`, color: f.accent }}>
                  {f.icon}
                </div>
                <div className="dash-card-text">
                  <h3>{f.title}</h3>
                  <p className="text-muted text-sm">{f.desc}</p>
                </div>
                <ArrowUpRight size={16} className="dash-card-arrow" />
              </Link>
            ))}
          </section>
        </div>
      </main>

      <footer className="dash-footer">
        <p className="text-muted text-sm">© {new Date().getFullYear()} MeshPay. All rights reserved.</p>
      </footer>

      <style>{`
        .dash-hero { padding: 3rem 0 2rem; }
        .dash-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; padding-bottom: 3rem; }
        .dash-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; text-decoration: none; position: relative; }
        .dash-card-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dash-card-text h3 { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); }
        .dash-card-arrow { position: absolute; top: 1rem; right: 1rem; color: var(--text-muted); transition: all var(--duration) var(--ease); }
        .dash-card:hover .dash-card-arrow { color: var(--accent); transform: translate(2px, -2px); }
        .dash-footer { padding: 2rem; text-align: center; border-top: 1px solid var(--border); }
        @media (max-width: 640px) { .dash-hero h1 { font-size: 1.75rem; } }
      `}</style>
    </>
  );
}
