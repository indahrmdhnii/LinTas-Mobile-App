import { Mic } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

export function VoiceButton() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        bottom: 88,
        right: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        zIndex: 30,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "#8E8E93",
          fontFamily: "'Poppins', sans-serif",
          textAlign: "center",
          maxWidth: 80,
          lineHeight: 1.3,
        }}
      >
        Perintah suara
      </span>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate("/voice-command")}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#1A6FBF",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(28,28,30,0.14)",
        }}
      >
        <Mic size={24} color="white" strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}
