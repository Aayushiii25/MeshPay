//Shows current balance
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

const CheckBalance = () => {
  const [balance, setBalance] = useState(null);
  const [pin, setPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchBalance = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/checkBalance`,
        { pin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBalance(res.data.balance);
      setShowPinModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid PIN");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }
    fetchBalance();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700/30 p-8 rounded-xl shadow-lg text-center w-[350px]">
          <h1 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Check Balance 💰
          </h1>

          {balance !== null ? (
            <p className="text-2xl font-semibold text-green-600">₹ {balance}</p>
          ) : (
            <p className="text-gray-500">Enter PIN to view balance</p>
          )}
        </div>

        {/* 🔐 PIN MODAL */}
        {showPinModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-lg w-80">
              <h2 className="mb-4 font-bold text-center text-black">
                Enter PIN 🔐
              </h2>

              <input
                type="password"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                className="w-full p-2 border rounded mb-4 text-black"
                placeholder="4 digit PIN"
              />

              <button
                onClick={handlePinSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg hover:scale-105 transition-all"
              >
                {loading ? "Checking..." : "Submit 🚀"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckBalance;
