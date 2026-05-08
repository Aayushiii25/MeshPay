import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";
import "./App.css";

// Auth
import Login from "./components/Login";
import Signup from "./components/Signup";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PayUPI = lazy(() => import("./pages/online/PayUPI"));
const Transaction = lazy(() => import("./pages/online/Transaction"));
const CheckBalance = lazy(() => import("./pages/online/CheckBalance"));
const QrCode = lazy(() => import("./pages/online/QrCode"));
const QrScanner = lazy(() => import("./pages/online/QrScanner"));
const BudgetTracker = lazy(() => import("./pages/utility/BudgetTracker"));
const Notes = lazy(() => import("./pages/utility/EnhancedOfflineNotes"));

// Offline pages (keep existing for now)
const PayUPIOffline = lazy(() => import("./pages/offline/PayUPIOffline"));
const OfflinePay = lazy(() => import("./pages/offline/OfflinePay"));

function PageLoader() {
  return (
    <div className="page-center">
      <div className="flex flex-col items-center gap-2">
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <p className="text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

            {/* Protected */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/pay" element={<ProtectedRoute><PayUPI /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
            <Route path="/balance" element={<ProtectedRoute><CheckBalance /></ProtectedRoute>} />
            <Route path="/qr" element={<ProtectedRoute><QrCode /></ProtectedRoute>} />
            <Route path="/qrscanner" element={<ProtectedRoute><QrScanner /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><BudgetTracker /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />

            {/* Offline */}
            <Route path="/offline" element={<ProtectedRoute><OfflinePay /></ProtectedRoute>} />
            <Route path="/offline/pay" element={<ProtectedRoute><PayUPIOffline /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <div className="page-center">
                <div className="text-center">
                  <h1 className="heading-xl">404</h1>
                  <p className="text-muted" style={{ marginTop: "0.5rem" }}>Page not found</p>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
