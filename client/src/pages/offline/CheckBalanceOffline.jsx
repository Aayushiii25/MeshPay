import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CheckBalanceOffline() {
  const [balance, setBalance] = useState("Not synced");
  const [pin, setPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(true);
  const [senderId, setSenderId] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.error("Error fetching user:", error);
      navigate("/login");
    }
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }

    setLoading(true);

    const data = {
      pin,
      senderId,
      option: "2",
    };

    const encrypt = btoa(JSON.stringify(data));

    const smsLink = `sms:+919350728474?body=${encrypt}`;
    window.open(smsLink);

    setTimeout(() => {
      setLoading(false);
      setShowPinModal(false);
      setBalance("Request Sent (Offline)");
    }, 1000);
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Offline Balance 💸</h1>

        <div className="text-xl">
          Status: <span className="font-bold text-indigo-600">{balance}</span>
        </div>

        {/* PIN MODAL */}
        {showPinModal && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-xl">
              <label className="font-bold block mb-2 text-black">
                Enter PIN 🔐
              </label>

              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="block w-full border border-gray-400 rounded-md px-3 py-2 mb-4 text-black"
                placeholder="4 digit PIN"
              />

              <div className="flex justify-center">
                <button
                  onClick={handlePinSubmit}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all"
                >
                  {loading ? "Sending..." : "Submit 🚀"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
