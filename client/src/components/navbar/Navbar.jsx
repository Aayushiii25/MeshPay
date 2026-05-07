import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaUser,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("userId"));
  const [username, setUsername] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // 🔥 Fetch user safely
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/getUser`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setUsername(res.data.user.userName);
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };

    if (user) fetchUser();
  }, [user]);

  // 🔥 Dark mode sync
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const toggleMenu = () => setIsActive(!isActive);
  const closeMenu = () => setIsActive(false);

  // 🔥 Clean logout
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  // 🔥 Clean search (no DOM hack)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles.dark : ""}`}>
      {/* Logo */}
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="logo" />
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>

      {/* Menu */}
      <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
        <li onClick={closeMenu}>
          <Link to="/" className={styles.navLink}>
            <FaHome /> Home
          </Link>
        </li>

        {!user ? (
          <>
            <li onClick={closeMenu}>
              <Link to="/login" className={styles.navLink}>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li onClick={closeMenu}>
              <Link to="/signup" className={styles.navLink}>
                <FaUserPlus /> Signup
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <span className={styles.navLink}>
                <FaUser /> {username}
              </span>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.navLink}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        )}

        {/* Dark mode */}
        <li>
          <button onClick={toggleDarkMode} className={styles.navLink}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </li>
      </ul>

      {/* Hamburger */}
      <div
        className={`${styles.hamburger} ${isActive ? styles.active : ""}`}
        onClick={toggleMenu}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>
    </nav>
  );
}

export default Navbar;
