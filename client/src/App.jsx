import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// 🔐 Auth
import Login from "./components/Login";
import Signup from "./components/Signup";
// 🌐 Online pages
import HomeOnline from "./pages/online/HomeOnline";
import PayUPI from "./pages/online/PayUPI";
import Transaction from "./pages/online/Transaction";
import CheckBalance from "./pages/online/CheckBalance";
import QrCode from "./pages/online/QrCode";
import QrScanner from "./pages/online/QrScanner";

// 📡 Offline pages
import HomeOffline from "./pages/offline/HomeOffline";
import PayUPIOffline from "./pages/offline/PayUPIOffline";
import TransactionOffline from "./pages/offline/TransactionOffline";
import CheckBalanceOffline from "./pages/offline/CheckBalanceOffline";
import OfflinePay from "./pages/offline/OfflinePay";

// 🧠 Utility pages
import BudgetTracker from "./pages/utility/BudgetTracker";
import EnhancedOfflineNotes from "./pages/utility/EnhancedOfflineNotes";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🌐 Online */}
        <Route path="/" element={<HomeOnline />} />
        <Route path="/qr" element={<QrCode />} />
        <Route path="/qrscanner" element={<QrScanner />} />
        <Route path="/payUpi" element={<PayUPI />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/checkBalance" element={<CheckBalance />} />

        {/* 📡 Offline */}
        <Route path="/offlinePay" element={<HomeOffline />} />
        <Route path="/offline" element={<OfflinePay />} />
        <Route path="/payUpiOffline" element={<PayUPIOffline />} />
        <Route path="/transactionOffline" element={<TransactionOffline />} />
        <Route path="/checkbalanceoffline" element={<CheckBalanceOffline />} />

        {/* 🧠 Utility */}
        <Route path="/budgetTracker" element={<BudgetTracker />} />
        <Route
          path="/enhancedofflinenotes"
          element={<EnhancedOfflineNotes />}
        />
      </Routes>
    </Router>
  );
}

export default App;
