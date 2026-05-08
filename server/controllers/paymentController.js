const mongoose = require("mongoose");
const User = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * POST /api/payments/send
 * Protected — send money via UPI
 */
const sendMoney = asyncHandler(async (req, res) => {
  const { amount, receiverUpi, pin } = req.body;
  const senderId = req.userId;

  // Validate
  if (!amount || !receiverUpi || !pin) {
    return res.status(400).json({ message: "Amount, receiver UPI, and PIN are required" });
  }

  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  // Fetch sender with pin
  const sender = await User.findById(senderId);
  if (!sender) {
    return res.status(404).json({ message: "Sender account not found" });
  }

  // Verify PIN
  if (!(await sender.matchPin(pin))) {
    return res.status(401).json({ message: "Incorrect PIN" });
  }

  // Prevent self-transfer
  if (sender.upiId === receiverUpi) {
    return res.status(400).json({ message: "Cannot send money to yourself" });
  }

  // Check balance
  if (sender.amount < parsedAmount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  // Find receiver
  const receiver = await User.findOne({ upiId: receiverUpi });
  if (!receiver) {
    return res.status(404).json({ message: "Receiver account not found" });
  }

  // Generate reference number
  const referenceNumber = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
  const transactionDate = new Date();

  // Atomic update (basic — for production use MongoDB transactions)
  sender.amount -= parsedAmount;
  receiver.amount += parsedAmount;

  sender.transactions.push({
    type: "Debit",
    referenceNumber,
    amount: parsedAmount,
    upiId: receiverUpi,
    date: transactionDate,
  });

  receiver.transactions.push({
    type: "Credit",
    referenceNumber,
    amount: parsedAmount,
    upiId: sender.upiId,
    date: transactionDate,
  });

  await sender.save();
  await receiver.save();

  res.status(200).json({
    message: "Payment successful",
    referenceNumber,
    amount: parsedAmount,
    receiver: receiverUpi,
  });
});

/**
 * POST /api/payments/check-balance
 * Protected — check balance with PIN verification
 */
const checkBalance = asyncHandler(async (req, res) => {
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({ message: "PIN is required" });
  }

  const user = await User.findById(req.userId);

  if (!(await user.matchPin(pin))) {
    return res.status(401).json({ message: "Invalid PIN" });
  }

  res.status(200).json({ balance: user.amount });
});

/**
 * POST /api/payments/send-offline
 * Offline payment processing via Twilio SMS
 */
const sendMoneyOffline = asyncHandler(async (req, res) => {
  const encodedData = req.body.message;

  if (!encodedData) {
    return res.status(400).json({ message: "Message data required" });
  }

  let data;
  try {
    const decodedData = Buffer.from(encodedData, "base64").toString("utf8");
    data = JSON.parse(decodedData);
  } catch {
    return res.status(400).json({ message: "Invalid encoded data" });
  }

  const choice = data.option;

  // Lazy-load Twilio only when needed
  let twilioClient = null;
  const getTwilio = () => {
    if (!twilioClient) {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      if (accountSid && authToken) {
        twilioClient = require("twilio")(accountSid, authToken);
      }
    }
    return twilioClient;
  };

  const sendSMS = async (body) => {
    const client = getTwilio();
    if (client && process.env.MY_PHONE_NUMBER) {
      try {
        await client.messages.create({
          body,
          from: process.env.TWILIO_PHONE_NUMBER || "+17752787510",
          to: process.env.MY_PHONE_NUMBER,
        });
      } catch (err) {
        console.error("SMS send failed:", err.message);
      }
    }
  };

  if (choice === "1") {
    // Send money offline
    const { pin, amount, receiverId, senderId } = data;

    if (!pin || !amount || !receiverId || !senderId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ upiId: receiverId });

    if (!sender) return res.status(404).json({ message: "Sender not found" });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    if (!(await sender.matchPin(pin))) {
      await sendSMS("Transaction Failed: Wrong PIN");
      return res.status(400).json({ message: "Wrong PIN" });
    }

    if (sender.amount < amount) {
      await sendSMS("Transaction Failed: Insufficient Balance");
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const referenceNumber = `OFL${Date.now()}`;
    sender.amount -= amount;
    receiver.amount += amount;

    const txDate = new Date();
    sender.transactions.push({ type: "Debit", referenceNumber, amount, upiId: receiverId, date: txDate });
    receiver.transactions.push({ type: "Credit", referenceNumber, amount, upiId: sender.upiId, date: txDate });

    await sender.save();
    await receiver.save();

    await sendSMS(`Rs.${amount} sent to ${receiverId} successfully. Ref: ${referenceNumber}`);
    return res.status(200).json({ message: "Payment successful", referenceNumber });

  } else if (choice === "2") {
    // Check balance offline
    const { pin, senderId } = data;
    if (!pin || !senderId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ message: "User not found" });

    if (!(await sender.matchPin(pin))) {
      await sendSMS("Balance check failed: Wrong PIN");
      return res.status(400).json({ message: "Wrong PIN" });
    }

    await sendSMS(`Your current balance is Rs.${sender.amount}`);
    return res.status(200).json({ balance: sender.amount });

  } else if (choice === "3") {
    // Get last 5 transactions
    const { senderId } = data;
    if (!senderId) return res.status(400).json({ message: "Missing sender ID" });

    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ message: "User not found" });

    const last5 = sender.transactions.slice(-5);
    await sendSMS(`Last 5 Transactions: ${JSON.stringify(last5)}`);
    return res.status(200).json({ transactions: last5 });

  } else {
    return res.status(400).json({ message: "Invalid option" });
  }
});

module.exports = { sendMoney, checkBalance, sendMoneyOffline };
