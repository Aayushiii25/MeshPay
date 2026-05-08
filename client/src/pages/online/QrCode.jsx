//Shows YOUR QR code to receive money
import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QrCodePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const qrRef = useRef(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
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

      setUser(res.data.user);
    } catch (err) {
      console.error("User fetch error:", err);
      setError("Failed to load user");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Structured payload (future-proof)
  const qrPayload = JSON.stringify({
    v: 1, // versioning
    type: "upi_request",
    upiId: user?.upiId,
    userId: user?._id,
  });

  // 📥 Download QR
  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "meshpay-qr.png";
    a.click();
  };

  // 📋 Copy UPI
  const copyUPI = () => {
    navigator.clipboard.writeText(user?.upiId || "");
    alert("UPI copied 👍");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Generating your MeshPay QR… 📡
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Your Payment QR 💸
        </h1>

        {/* QR CARD */}
        <div
          ref={qrRef}
          className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20"
        >
          <QRCodeCanvas
            value={qrPayload}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* UPI */}
        <div className="bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-md border text-center">
          <p className="text-sm text-gray-500">UPI ID</p>
          <p className="font-semibold">{user?.upiId}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={copyUPI}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
          >
            Copy UPI
          </button>

          <button
            onClick={downloadQR}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
          >
            Download QR
          </button>
        </div>
      </div>
    </>
  );
};

export default QrCodePage;
