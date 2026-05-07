import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WifiTetheringOffIcon from "@mui/icons-material/WifiTetheringOff";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TollIcon from "@mui/icons-material/Toll";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NoteIcon from "@mui/icons-material/Note";

const Hero = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode properly
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // 🔥 DATA DRIVEN (clean code)
  const features = [
    {
      title: "Check Balance",
      desc: "View your account balance instantly.",
      icon: <AccountBalanceIcon />,
      link: "/checkBalance",
      gradient: "from-amber-400 via-orange-500 to-red-500",
      color: "amber",
    },
    {
      title: "Pay via UPI",
      desc: "Make quick and secure UPI payments.",
      icon: <TollIcon />,
      link: "/payUpi",
      gradient: "from-lime-400 via-green-500 to-emerald-500",
      color: "lime",
    },
    {
      title: "Pay Offline",
      desc: "Pay without an internet connection.",
      icon: <WifiTetheringOffIcon />,
      link: "/offlinePay",
      gradient: "from-violet-400 via-purple-500 to-fuchsia-500",
      color: "violet",
    },
    {
      title: "Scan QR",
      desc: "Scan QR codes to make payments.",
      icon: <QrCodeScannerIcon />,
      link: "/qrscanner",
      gradient: "from-indigo-400 via-purple-500 to-pink-500",
      color: "indigo",
    },
    {
      title: "Receive Money",
      desc: "Receive payments directly to your account.",
      icon: <CurrencyRupeeIcon />,
      link: "/qr",
      gradient: "from-teal-400 via-cyan-500 to-blue-500",
      color: "teal",
    },
    {
      title: "Transaction History",
      desc: "View all your past transactions.",
      icon: <ReceiptLongIcon />,
      link: "/transaction",
      gradient: "from-pink-400 via-rose-500 to-red-500",
      color: "pink",
    },
    {
      title: "Budget Tracker",
      desc: "Track and manage your monthly budget.",
      icon: <AttachMoneyIcon />,
      link: "/budgetTracker",
      gradient: "from-cyan-400 via-sky-500 to-blue-500",
      color: "cyan",
    },
    {
      title: "Save Notes",
      desc: "Store and manage notes offline.",
      icon: <NoteIcon />,
      link: "/enhancedofflinenotes",
      gradient: "from-rose-400 via-pink-500 to-red-500",
      color: "rose",
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-6 relative overflow-hidden">
        {/* subtle glow bg (NOT overkill) */}
        <div className="absolute w-[400px] h-[400px] bg-purple-400 opacity-10 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-400 opacity-10 blur-3xl rounded-full bottom-10 right-10"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Seamless Payments, Anytime, Anywhere
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Explore our features to manage your finances effortlessly.
          </p>

          {/* 🔥 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <Link to={item.link} key={index} className="group">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: index * 0.15 }}
                >
                  <div
                    className={`relative p-1 rounded-lg bg-gradient-to-r ${item.gradient} 
                    animate-gradient-border hover:scale-105 hover:-translate-y-1 
                    transition-all duration-300 shadow-lg`}
                  >
                    <div
                      className="flex flex-col items-center justify-center 
                      bg-white/70 dark:bg-gray-800/70 
                      backdrop-blur-md border border-white/20 dark:border-gray-700/30
                      rounded-lg p-8 h-64 w-full 
                      hover:bg-gray-50 dark:hover:bg-gray-700 
                      transition-colors"
                    >
                      <div className="text-5xl mb-4 group-hover:rotate-6 transition-transform group-hover:drop-shadow-glow">
                        {item.icon}
                      </div>

                      <span
                        className={`text-lg font-semibold text-${item.color}-800 dark:text-${item.color}-200`}
                      >
                        {item.title}
                      </span>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} MeshPay. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
