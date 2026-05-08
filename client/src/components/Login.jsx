import React, { useState, useEffect, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import logo from "../assets/logo.png";

import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const userNameRef = useRef(null);

  useEffect(() => {
    userNameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        {
          userName,
          password,
        },
      );

      localStorage.setItem("userId", res.data.user._id);

      localStorage.setItem("user", res.data.user.upiId);

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful 🚀");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border p-8">
        {/* logo */}
        <img src={logo} alt="logo" className="w-28 mx-auto mb-6" />

        {/* tabs */}
        <div className="flex gap-2 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border shadow text-sm">
            <LogIn size={16} />
            Login
          </button>

          <Link
            to="/signup"
            className="flex items-center gap-2 px-4 py-2 text-gray-500 text-sm"
          >
            <UserPlus size={16} />
            Sign Up
          </Link>
        </div>

        {/* title */}
        <h1 className="text-3xl font-bold mb-2">Welcome Back 🚀</h1>

        <p className="text-gray-500 mb-8">Login to continue to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* username */}
          <input
            ref={userNameRef}
            type="text"
            placeholder="Enter username"
            required
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border rounded-2xl px-5 py-4"
          />

          {/* password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-2xl px-5 py-4 pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* button */}
          <button
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-medium"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* footer */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Don’t have an account?
          <Link to="/signup" className="ml-2 font-medium text-black">
            Sign up
          </Link>
        </p>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}
