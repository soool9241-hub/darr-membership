import { useEffect, useCallback } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "20px",
          width: "100%", maxWidth: "480px", maxHeight: "90vh",
          overflowY: "auto", padding: "32px 28px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
          animation: "slideUp 0.3s ease",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "24px",
        }}>
          <h3 style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: "22px", fontWeight: 700, color: "#1B1B18", margin: 0,
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", fontSize: "24px",
              color: "#8A9A8E", cursor: "pointer", padding: "4px 8px",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>
        {children}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
