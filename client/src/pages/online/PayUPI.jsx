//Send money using UPI
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../../components/navbar/Navbar";

const PayUPI = () => {
  const [step, setStep] = useState(1); // 🔥 clean step control
  const [loading, setLoading] = useState(false);
  const [statusPopup, setStatusPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [paymentData, setPaymentData] = useState({
    senderId: localStorage.getItem("userId"), // 🔥 no API call
    receiverUpi: "",
    amount: "",
    pin: "",
  });

  const navigate = useNavigate();

  // 🔥 validation
  const validateUPI = (upi) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upi);

  // STEP 1 → UPI
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

    setStep(3);
  };

  // STEP 3 → PIN + API
  const handlePayment = async () => {
    if (paymentData.pin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/sendMoney`,
        {
          ...paymentData,
          amount: Number(paymentData.amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess(true);
      setStatusPopup(true);
    } catch (error) {
      setSuccess(false);
      setErrorMessage(error.response?.data?.message || "Payment failed");
      setStatusPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPaymentData({
      senderId: paymentData.senderId,
      receiverUpi: "",
      amount: "",
      pin: "",
    });
    setStep(1);
    setStatusPopup(false);
    navigate("/");
  };

  return (
    <>
      <Navbar />

      {/* STEP UI */}
      {step === 1 && (
        <Modal title="Enter UPI">
          <Input
            value={paymentData.receiverUpi}
            onChange={(val) =>
              setPaymentData({ ...paymentData, receiverUpi: val })
            }
            placeholder="example@upi"
          />
          <Button onClick={handleReceiver}>Next</Button>
        </Modal>
      )}

      {step === 2 && (
        <Modal title="Enter Amount">
          <Input
            type="number"
            value={paymentData.amount}
            onChange={(val) => setPaymentData({ ...paymentData, amount: val })}
          />
          <Button onClick={() => setStep(1)}>Back</Button>
          <Button onClick={handleAmount}>Next</Button>
        </Modal>
      )}

      {step === 3 && (
        <Modal title="Enter PIN">
          <Input
            type="password"
            value={paymentData.pin}
            onChange={(val) =>
              setPaymentData({
                ...paymentData,
                pin: val.replace(/\D/g, "").slice(0, 4),
              })
            }
          />
          <Button onClick={() => setStep(2)}>Back</Button>
          <Button onClick={handlePayment}>
            {loading ? "Processing..." : "Pay 🚀"}
          </Button>
        </Modal>
      )}

      {/* STATUS POPUP */}
      {statusPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-gray-700 p-6 rounded-xl text-center w-80">
            <h2 className="text-xl mb-2">
              {success ? "Success 🎉" : "Failed ❌"}
            </h2>
            <p>
              {success
                ? `₹${paymentData.amount} sent to ${paymentData.receiverUpi}`
                : errorMessage}
            </p>
            <button onClick={reset} className="btn mt-4">
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PayUPI;

/* 🔥 reusable components (clean code) */

const Modal = ({ title, children }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-black/50">
    <div className="bg-gray-300 p-4 rounded-md w-80">
      <h2 className="mb-3 font-bold">{title}</h2>
      {children}
    </div>
  </div>
);

const Input = ({ value, onChange, ...props }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-2 mb-3 border rounded"
    {...props}
  />
);

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded mr-2"
  >
    {children}
  </button>
);
