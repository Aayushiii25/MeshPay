const express = require("express");
const { sendMoney, checkBalance, sendMoneyOffline } = require("../controllers/paymentController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/send", auth, sendMoney);
router.post("/check-balance", auth, checkBalance);
router.post("/send-offline", sendMoneyOffline);

module.exports = router;
