import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    pin: "",
    phoneNo: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNaN(formData.pin) || formData.pin.length !== 4) {
        throw new Error("PIN must be 4 digits");
      }

      if (isNaN(formData.phoneNo) || formData.phoneNo.length !== 10) {
        throw new Error("Phone number must be 10 digits");
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, {
        ...formData,
        pin: Number(formData.pin),
        phoneNo: Number(formData.phoneNo),
      });

      toast.success("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Signup failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 
    bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 
    dark:from-black dark:via-gray-900 dark:to-black 
    relative overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-purple-400 opacity-20 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-400 opacity-20 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      <section className="w-full relative z-10">
        <div className="flex flex-col items-center justify-center px-6 mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center mb-8 hover:scale-110 transition-transform"
          >
            <img className="w-60 h-20" src={logo} alt="logo" />
          </Link>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl rounded-xl 
            bg-white/80 backdrop-blur-xl 
            border border-white/20 
            shadow-[0_0_40px_rgba(99,102,241,0.3)] 
            hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] 
            transition-all duration-500"
          >
            <div className="p-8 space-y-6">
              {/* Title */}
              <h1
                className="text-4xl font-extrabold text-center 
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
              bg-clip-text text-transparent animate-pulse"
              >
                Create Account
              </h1>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Username */}
                <input
                  type="text"
                  name="userName"
                  placeholder="Username"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/80 border rounded-lg 
                  focus:ring-2 focus:ring-indigo-500 
                  focus:shadow-[0_0_10px_rgba(99,102,241,0.8)] 
                  transition-all"
                />

                {/* Full Name */}
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/80 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/80 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />

                {/* PIN */}
                <input
                  type="number"
                  name="pin"
                  placeholder="4-digit PIN"
                  required
                  value={formData.pin}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/80 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />

                {/* Phone */}
                <input
                  type="tel"
                  name="phoneNo"
                  placeholder="Phone Number"
                  required
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/80 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 bg-white/80 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Loading */}
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin h-10 w-10 border-t-2 border-indigo-500 rounded-full"></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                    text-white py-3 rounded-lg text-xl font-bold 
                    hover:shadow-[0_0_20px_rgba(236,72,153,0.8)] 
                    transform hover:scale-110 transition-all"
                  >
                    Sign Up 🚀
                  </button>
                )}

                {/* Login */}
                <p className="text-center text-lg">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Toaster position="bottom-center" />
    </div>
  );
}
