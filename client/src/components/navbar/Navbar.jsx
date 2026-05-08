import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home, CreditCard, QrCode, PieChart, StickyNote, LogOut,
  Menu, X, Wallet, User
} from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    { path: "/pay", label: "Pay", icon: <CreditCard size={18} /> },
    { path: "/qr", label: "QR", icon: <QrCode size={18} /> },
    { path: "/transactions", label: "History", icon: <Wallet size={18} /> },
    { path: "/budget", label: "Budget", icon: <PieChart size={18} /> },
    { path: "/notes", label: "Notes", icon: <StickyNote size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">M</div>
          <span className="brand-text">MeshPay</span>
        </Link>

        <div className={`navbar-menu ${open ? "navbar-menu--open" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? "nav-link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {user && (
            <div className="nav-user">
              <div className="nav-user-avatar"><User size={16} /></div>
              <span className="nav-user-name">{user.userName}</span>
            </div>
          )}
          {user && (
            <button className="nav-link nav-logout" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          )}
          <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
