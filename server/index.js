require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/dbConnect");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ─── Security & Middleware ────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" })); // Prevent large payload DoS
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Routes ───────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const budgetRoutes = require("./routes/budgetApiRoutes");
const noteRoutes = require("./routes/noteApiRoutes");

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "MeshPay API v2.0",
    endpoints: {
      auth: "/api/auth",
      payments: "/api/payments",
      budget: "/api/budget",
      notes: "/api/notes",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/notes", noteRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

// ─── Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 MeshPay API running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
