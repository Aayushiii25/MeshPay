import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { Download, Copy, Check } from "lucide-react";

export default function QrCode() {
  const { user } = useAuth();
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const qrPayload = JSON.stringify({ v: 1, type: "upi_request", upiId: user?.upiId, userId: user?._id });

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "meshpay-qr.png";
    a.click();
    toast.success("QR downloaded");
  };

  const copyUPI = async () => {
    await navigator.clipboard.writeText(user?.upiId || "");
    setCopied(true);
    toast.success("UPI copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <div className="page-center">
        <div className="modal-content animate-in text-center" style={{ maxWidth: 380 }}>
          <h2 className="heading-md" style={{ marginBottom: "1.5rem" }}>Your QR Code</h2>
          <div ref={qrRef} style={{ background: "white", borderRadius: 16, padding: 24, display: "inline-block", margin: "0 auto" }}>
            <QRCodeCanvas value={qrPayload} size={200} level="H" includeMargin={false} />
          </div>
          <div className="glass-card" style={{ padding: "0.875rem", marginTop: "1.25rem", textAlign: "center" }}>
            <p className="text-muted text-xs">UPI ID</p>
            <p style={{ fontWeight: 600, fontFamily: "var(--font-display)" }}>{user?.upiId}</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={copyUPI}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy UPI"}
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={downloadQR}>
              <Download size={16} /> Download
            </button>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" } }} />
    </>
  );
}
