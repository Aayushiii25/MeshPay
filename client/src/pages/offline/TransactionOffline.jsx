import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

const TransactionOffline = () => {
  const [senderId, setSenderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/getUser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSenderId(res.data.user._id);
    } catch (error) {
      console.error("User fetch error:", error);
      navigate("/login");
    }
  };

  const handleSubmit = () => {
    if (!senderId) {
      alert("User not loaded");
      return;
    }

    setLoading(true);

    const data = {
      senderId,
      option: "3", // 🔥 transaction request
      timestamp: new Date().toISOString(),
    };

    const encoded = btoa(JSON.stringify(data));

    const smsLink = `sms:+919350728474?body=${encoded}`;
    window.open(smsLink);

    setTimeout(() => {
      setLoading(false);
      setStatus("Request sent via SMS 📡");
    }, 800);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700/30 p-8 rounded-xl shadow-lg text-center w-[320px]">
          <h1 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Offline Transactions 📜
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Get your last 5 transactions via SMS without internet.
          </p>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg hover:scale-105 transition-all"
          >
            {loading ? "Sending..." : "Get Transactions 📩"}
          </button>

          {status && <p className="mt-4 text-green-600 text-sm">{status}</p>}
        </div>
      </div>
    </>
  );
};

export default TransactionOffline;
