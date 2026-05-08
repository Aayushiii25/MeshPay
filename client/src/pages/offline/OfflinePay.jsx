import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function OfflinePay() {
  const navigate = useNavigate();

  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [scanner, setScanner] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [paymentData, setPaymentData] = useState({
    senderId: "",
    receiverId: "",
    amount: "",
    pin: "",
    option: "1",
  });

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
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setPaymentData((prev) => ({
        ...prev,
        senderId: res.data.user._id,
      }));
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  const qrData = (text) => {
    try {
      const parsed = JSON.parse(text);

      setPaymentData((prev) => ({
        ...prev,
        receiverId: parsed.upiId,
      }));

      setScanner(false);
      setShowAmountModal(true);
    } catch (err) {
      alert("Invalid QR");
    }
  };

  const handlePay = () => {
    if (!paymentData.amount || paymentData.amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (paymentData.amount > 2000) {
      alert("Max limit is ₹2000");
      return;
    }

    setShowAmountModal(false);
    setShowPinModal(true);
  };

  const handlePinSubmit = () => {
    if (paymentData.pin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }

    setLoading(true);

    const encrypt = btoa(JSON.stringify(paymentData));

    const smsLink = `sms:+919350728474?body=${encrypt}`;
    window.open(smsLink);

    setTimeout(() => {
      setLoading(false);
      setShowPinModal(false);
      setStatus("Payment Request Sent 📡");
    }, 1000);
  };

  return (
    <>
      <Navbar />

      <div className="mt-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Offline Pay 📡</h1>
        <p className="text-gray-600">Scan QR to pay without internet</p>

        {status && (
          <p className="mt-4 text-green-600 font-semibold">{status}</p>
        )}
      </div>

      <div className="relative m-auto mt-10 w-[300px]">
        <Scanner
          onResult={(text) => qrData(text)}
          enabled={scanner}
          onError={(err) => console.log(err?.message)}
        />
      </div>

      {/* Amount Modal */}
      {showAmountModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-lg">
            <p className="mb-2">UPI ID: {paymentData.receiverId}</p>

            <input
              type="number"
              placeholder="Enter amount"
              value={paymentData.amount}
              onChange={(e) =>
                setPaymentData({ ...paymentData, amount: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />

            <button
              onClick={handlePay}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:scale-105"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-lg">
            <input
              type="password"
              placeholder="Enter PIN"
              value={paymentData.pin}
              onChange={(e) =>
                setPaymentData({ ...paymentData, pin: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />

            <button
              onClick={handlePinSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Sending..." : "Pay 🚀"}
            </button>
          </div>
        </div>
      )}

      <p className="text-center mt-6 text-sm text-gray-500">Max Limit: ₹2000</p>
    </>
  );
}
