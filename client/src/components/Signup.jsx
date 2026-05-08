import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/logo.png";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

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

      toast.success("Registration successful 🚀");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 text-gray-500 text-sm"
          >
            <LogIn size={16} />
            Login
          </Link>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border shadow text-sm">
            <UserPlus size={16} />
            Sign Up
          </button>
        </div>

        {/* heading */}
        <h1 className="text-3xl font-bold mb-2">Create Account ✨</h1>

        <p className="text-gray-500 mb-8">Join MeshPay today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            required
            className="w-full border rounded-2xl px-5 py-4"
          />

          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border rounded-2xl px-5 py-4"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-2xl px-5 py-4"
          />

          <input
            name="pin"
            placeholder="4-digit PIN"
            value={formData.pin}
            onChange={handleChange}
            required
            className="w-full border rounded-2xl px-5 py-4"
          />

          <input
            name="phoneNo"
            placeholder="Phone Number"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            className="w-full border rounded-2xl px-5 py-4"
          />

          {/* password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
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

          <button
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-medium"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?
          <Link to="/login" className="ml-2 font-medium text-black">
            Login
          </Link>
        </p>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}
