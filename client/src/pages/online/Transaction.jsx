import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Transaction = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");

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

      const txns = [...(res.data.user.transactions || [])].reverse();

      setTransactions(txns);
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesFilter = filter === "All" || txn.type === filter;

      const matchesSearch =
        txn.upiId?.toLowerCase().includes(search.toLowerCase()) ||
        txn.referenceNumber?.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [transactions, search, filter]);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const renderSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
      ))}
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Transaction History 📜</h1>

          <button
            onClick={fetchTransactions}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm"
          >
            Refresh
          </button>
        </div>

        {/* controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search UPI / Ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border p-3 rounded-lg"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option>All</option>
            <option>Debit</option>
            <option>Credit</option>
          </select>
        </div>

        {/* loading */}
        {loading && renderSkeleton()}

        {/* error */}
        {!loading && error && (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>

            <button
              onClick={fetchTransactions}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        )}

        {/* empty */}
        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No transactions found.</p>
          </div>
        )}

        {/* list */}
        {!loading && !error && filteredTransactions.length > 0 && (
          <div className="space-y-4">
            {filteredTransactions.map((txn) => {
              const isDebit = txn.type === "Debit";

              return (
                <div
                  key={txn._id}
                  className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex justify-between">
                    {/* left */}
                    <div>
                      <p className="text-sm text-gray-500">
                        {isDebit ? "Sent To" : "Received From"}
                      </p>

                      <p className="font-semibold text-lg">{txn.upiId}</p>

                      <p className="text-xs text-gray-400 mt-2">
                        Ref: {txn.referenceNumber}
                      </p>
                    </div>

                    {/* right */}
                    <div className="text-right">
                      <p
                        className={`font-bold text-xl ${
                          isDebit ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {isDebit ? "-" : "+"}₹{txn.amount}
                      </p>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          isDebit
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {txn.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    {formatDate(txn.date)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Transaction;
