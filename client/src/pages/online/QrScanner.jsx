//Scan someone else’s QR
import React, { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";

const QrScanner = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0=scan,1=amount,2=pin
  const [loading, setLoading] = useState(false);

  const [paymentData, setPaymentData] = useState({
    senderId: localStorage.getItem("userId"),
    receiverUpi: "",
    amount: "",
    pin: "",
  });

  // 🔐 Validate QR payload
  const parseQR = (text) => {
    try {
      const data = JSON.parse(text);

      if (!data.upiId || !data.userId) {
        throw new Error("Invalid QR");
      }

      setPaymentData((prev) => ({
        ...prev,
        receiverUpi: data.upiId,
      }));

      setStep(1);
    } catch {
      alert("Invalid QR code ❌");
    }
  };

  // 💸 Amount validation
  const handleAmount = () => {
    const amt = Number(paymentData.amount);

    if (!amt || amt <= 0) {
      alert("Enter valid amount");
      return;
    }

    setStep(2);
  };

  // 🔐 PIN + API
  const handlePayment = async () => {
    if (paymentData.pin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/sendMoney`,
        {
          ...paymentData,
          amount: Number(paymentData.amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Payment Successful 🎉");
      reset();
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setPaymentData({
      senderId: localStorage.getItem("userId"),
      receiverUpi: "",
      amount: "",
      pin: "",
    });
  };

  return (
    <>
      <Navbar />

      <div className="mt-20 text-center">
        <h1 className="text-xl font-bold mb-4">Scan & Pay 📷</h1>
      </div>

      {/* SCANNER */}
      {step === 0 && (
        <div className="w-[300px] m-auto mt-6">
          <Scanner
            onResult={(text) => parseQR(text)}
            enabled={true}
            onError={(e) => console.log(e?.message)}
          />
        </div>
      )}

      {/* AMOUNT */}
      {step === 1 && (
        <div className="flex justify-center mt-10">
          <div className="bg-white/80 p-6 rounded-xl shadow-lg w-80">
            <p className="mb-2">UPI: {paymentData.receiverUpi}</p>

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
              onClick={handleAmount}
              className="w-full bg-indigo-500 text-white py-2 rounded"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* PIN */}
      {step === 2 && (
        <div className="flex justify-center mt-10">
          <div className="bg-white/80 p-6 rounded-xl shadow-lg w-80">
            <input
              type="password"
              placeholder="Enter PIN"
              value={paymentData.pin}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                })
              }
              className="w-full p-2 border rounded mb-4"
            />

            <button
              onClick={handlePayment}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              {loading ? "Processing..." : "Pay 🚀"}
            </button>

            <button
              onClick={reset}
              className="w-full mt-2 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QrScanner;
