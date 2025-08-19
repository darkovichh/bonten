// components/ClickOverlay.js
import { useState } from "react";

export default function ClickOverlay() {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  const handleClick = () => {
    setFade(true); // Opacity düşür
    setTimeout(() => setVisible(false), 500); // 0.5s sonra tamamen kaldır
  };

  if (!visible) {
    return null; // Sayfa içeriği yok, sadece kaybolur
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        inset: 0,
        background: "#0A0A0A",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "clamp(1.5rem, 5vw, 3rem)", // Responsive font-size
        cursor: "pointer",
        zIndex: 9999,
        opacity: fade ? 0 : 1,
        transition: "opacity 0.5s ease",
        textAlign: "center",
        padding: "0 10px", // Küçük ekranlarda taşma olmasın
        fontWeight: "900",
      }}
    >
      Click to enter
    </div>
  );
}
