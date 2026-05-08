import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../../components/navbar/Navbar";

const PayOffline = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const [paymentData, setPaymentData] = useState({
    senderId: "",
    receiverUpi: "",
    amount: "",
    pin: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    setPaymentData((prev) => ({
      ...prev,
      senderId: userId,
    }));
  }, []);

  // 🔥 Validate UPI
  const validateUPI = (upi) => {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upi);
  };

  // STEP 1 → Receiver
  const handleReceiver = () => {
    if (!paymentData.receiverUpi) {
      toast.error("UPI required");
      return;
    }
    if (!validateUPI(paymentData.receiverUpi)) {
      toast.error("Invalid UPI");
      return;
    }
    setStep(2);
  };

  // STEP 2 → Amount
  const handleAmount = () => {
    const amount = Number(paymentData.amount);

    if (!amount || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    if (amount > 2000) {
      toast.error("Offline limit ₹2000");
      return;
    }

    setStep(3);
  };

  // STEP 3 → PIN & SAVE OFFLINE
  const handlePayment = () => {
    if (paymentData.pin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    setIsProcessing(true);

    // 🔥 STORE OFFLINE
    const transaction = {
      ...paymentData,
      status: "pending",
      mode: "offline",
      createdAt: new Date(),
    };

    const existing = JSON.parse(localStorage.getItem("offlineTx")) || [];

    localStorage.setItem(
      "offlineTx",
      JSON.stringify([...existing, transaction]),
    );

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentSuccessful(true);
    }, 1000);
  };

  const reset = () => {
    setPaymentData({
      senderId: paymentData.senderId,
      receiverUpi: "",
      amount: "",
      pin: "",
    });
    setStep(1);
    setIsPaymentSuccessful(false);
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="glass-card p-6 w-80">
            <h2 className="mb-4 font-bold">Enter UPI</h2>

            <input
              value={paymentData.receiverUpi}
              onChange={(e) =>
                setPaymentData({ ...paymentData, receiverUpi: e.target.value })
              }
              placeholder="example@upi"
              className="input"
            />

            <button onClick={handleReceiver} className="btn">
              Next →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="glass-card p-6 w-80">
            <h2 className="mb-4 font-bold">Enter Amount</h2>

            <input
              type="number"
              value={paymentData.amount}
              onChange={(e) =>
                setPaymentData({ ...paymentData, amount: e.target.value })
              }
              className="input"
            />

            <button onClick={handleAmount} className="btn">
              Next →
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="glass-card p-6 w-80">
            <h2 className="mb-4 font-bold">Enter PIN</h2>

            <input
              type="password"
              value={paymentData.pin}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                })
              }
              className="input"
            />

            <button onClick={handlePayment} className="btn">
              {isProcessing ? "Processing..." : "Pay 🚀"}
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {isPaymentSuccessful && (
          <div className="glass-card p-6 text-center w-80">
            <h2 className="text-green-500 text-xl mb-4">Payment Stored 📡</h2>

            <p>
              ₹{paymentData.amount} → {paymentData.receiverUpi}
            </p>

            <p className="text-sm mt-2 text-gray-500">Will sync when online</p>

            <button onClick={reset} className="btn mt-4">
              Done
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PayOffline;
