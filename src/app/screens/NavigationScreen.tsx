import { useState } from "react";
import { useNavigate } from "react-router";
import { X, MoreHorizontal, Train, MapPin, Users, AlertTriangle } from "lucide-react";
import { TransitBadge, StatusChip } from "../components/TransitBadge";
import { AlertBanner } from "../components/AlertBanner";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { BottomSheet } from "../components/BottomSheet";
import { motion } from "motion/react";

const steps = [
  {
    id: 1,
    status: "active",
    icon: Train,
    iconColor: "#1A6FBF",
    title: "Stasiun Sudirman",
    subtitle: "Masuk dari Pintu 2A — Peron 2",
    chip: { label: "Sekarang", bg: "#1A6FBF", color: "#FFFFFF" },
  },
  {
    id: 2,
    status: "passed",
    icon: null,
    title: "Stasiun Senayan",
    subtitle: "Tidak turun",
  },
  {
    id: 3,
    status: "upcoming",
    icon: null,
    title: "Stasiun Blok M",
    subtitle: "Turun — jalan 3 mnt ke halte",
  },
  {
    id: 4,
    status: "destination",
    icon: MapPin,
    iconColor: "#C9423A",
    title: "Lebak Bulus",
    subtitle: "Estimasi tiba: 07.54 WIB",
  },
];

export function NavigationScreen() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [showArrivalSheet, setShowArrivalSheet] = useState(false);
  const [showDisruptionSheet, setShowDisruptionSheet] = useState(false);

  const handleStopNavigation = () => {
    setShowStopDialog(false);
    navigate("/home", { replace: true });
  };

  const handleArrival = () => {
    setShowArrivalSheet(false);
    navigate("/ringkasan-perjalanan");
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: "#F7F7F5", fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "12px 20px",
          boxShadow: "0 1px 4px rgba(28,28,30,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setShowStopDialog(true)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <X size={24} color="#1C1C1E" strokeWidth={1.5} />
        </button>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: "#1C1C1E",
            margin: 0,
            letterSpacing: -0.1,
          }}
        >
          Bundaran HI → Lebak Bulus
        </h2>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <MoreHorizontal size={24} color="#8E8E93" strokeWidth={1.5} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 96 }}>
        {/* ETA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            margin: "16px 20px 0",
            padding: 24,
            boxShadow: "0 4px 16px rgba(28,28,30,0.10)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: "#8E8E93",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              margin: 0,
            }}
          >
            ESTIMASI TIBA
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#1C1C1E",
              margin: "4px 0 8px",
              letterSpacing: -0.3,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            12 menit
          </p>
          <p style={{ fontSize: 15, fontWeight: 400, color: "#3C3C43", margin: "0 0 12px" }}>
            Tiba sekitar pukul 07.54
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <TransitBadge type="MRT" />
            <StatusChip status="on-time" />
          </div>
        </motion.div>

        {/* Disruption alert */}
        {showAlert && (
          <div style={{ padding: "12px 20px 0" }}>
            <AlertBanner
              severity="error"
              message="Keterlambatan terdeteksi."
              subMessage="Rute alternatif tersedia."
              actionLabel="Lihat Alternatif"
              onAction={() => navigate("/detail-gangguan")}
            />
          </div>
        )}

        {/* Journey Steps */}
        <div style={{ padding: "16px 20px 0" }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 500,
              color: "#1C1C1E",
              margin: "0 0 16px",
              letterSpacing: -0.1,
            }}
          >
            Langkah Perjalanan
          </h2>

          <div style={{ position: "relative" }}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === steps.length - 1;
              const isActive = step.status === "active";
              const isPassed = step.status === "passed";
              const isDestination = step.status === "destination";

              return (
                <div
                  key={step.id}
                  style={{
                    display: "flex",
                    gap: 16,
                    position: "relative",
                    paddingBottom: isLast ? 0 : 20,
                  }}
                >
                  {/* Timeline indicator */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: isActive ? 14 : 12,
                        height: isActive ? 14 : 12,
                        borderRadius: "50%",
                        backgroundColor: isActive
                          ? "#1A6FBF"
                          : isPassed
                          ? "#EEEEED"
                          : isDestination
                          ? "#C9423A"
                          : "transparent",
                        border: isActive
                          ? "none"
                          : isPassed
                          ? "none"
                          : `2px solid ${isDestination ? "#C9423A" : "#EEEEED"}`,
                        zIndex: 1,
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                    {!isLast && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          backgroundColor: "#EEEEED",
                          marginTop: 4,
                          minHeight: 24,
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      {Icon && <Icon size={16} color={step.iconColor} strokeWidth={1.5} />}
                      <p
                        style={{
                          fontSize: isActive ? 17 : 15,
                          fontWeight: isActive ? 500 : isDestination ? 600 : 400,
                          color: isPassed ? "#8E8E93" : "#1C1C1E",
                          margin: 0,
                          letterSpacing: -0.1,
                        }}
                      >
                        {step.title}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: isPassed ? "#8E8E93" : "#3C3C43",
                        margin: "0 0 6px",
                      }}
                    >
                      {step.subtitle}
                    </p>
                    {step.chip && (
                      <span
                        style={{
                          backgroundColor: step.chip.bg,
                          color: step.chip.color,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 100,
                          display: "inline-block",
                        }}
                      >
                        {step.chip.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Density card */}
        <div style={{ padding: "16px 20px 0" }}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={16} color="#8E8E93" strokeWidth={1.5} />
              <span style={{ fontSize: 15, fontWeight: 400, color: "#1C1C1E" }}>Kepadatan</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[1, 2, 3].map((seg) => (
                  <div
                    key={seg}
                    style={{
                      width: 20,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: seg === 1 ? "#2A9D6F" : "#EEEEED",
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 11, fontWeight: 400, color: "#2A9D6F" }}>Rendah</span>
            </div>
          </div>
        </div>

        {/* Demo controls */}
        <div style={{ padding: "16px 20px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowAlert(!showAlert)}
            style={{
              padding: "6px 12px",
              backgroundColor: "transparent",
              border: "1px solid #EEEEED",
              borderRadius: 8,
              fontSize: 11,
              color: "#8E8E93",
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
            }}
          >
            {showAlert ? "Sembunyikan" : "Simulasi"} gangguan
          </button>
          <button
            onClick={() => setShowArrivalSheet(true)}
            style={{
              padding: "6px 12px",
              backgroundColor: "transparent",
              border: "1px solid #EEEEED",
              borderRadius: 8,
              fontSize: 11,
              color: "#8E8E93",
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
            }}
          >
            Simulasi tiba
          </button>
          <button
            onClick={() => setShowDisruptionSheet(true)}
            style={{
              padding: "6px 12px",
              backgroundColor: "transparent",
              border: "1px solid #EEEEED",
              borderRadius: 8,
              fontSize: 11,
              color: "#8E8E93",
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
            }}
          >
            Simulasi reroute
          </button>
        </div>
      </div>

      {/* Stop Navigation Button */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px 20px",
          backgroundColor: "#F7F7F5",
        }}
      >
        <button
          onClick={() => setShowStopDialog(true)}
          style={{
            width: "100%",
            height: 52,
            backgroundColor: "#C9423A",
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            borderRadius: 16,
            border: "none",
            cursor: "pointer",
          }}
        >
          Hentikan Navigasi
        </button>
      </div>

      {/* Stop confirmation dialog */}
      <ConfirmationDialog
        visible={showStopDialog}
        title="Hentikan Navigasi?"
        description="Navigasi yang sedang berjalan akan dihentikan. Kamu bisa memulai rute baru kapan saja."
        confirmLabel="Hentikan"
        cancelLabel="Lanjutkan"
        variant="destructive"
        onConfirm={handleStopNavigation}
        onCancel={() => setShowStopDialog(false)}
      />

      {/* Arrival Bottom Sheet */}
      <BottomSheet
        visible={showArrivalSheet}
        height="small"
        onDismiss={() => setShowArrivalSheet(false)}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#1C1C1E",
              margin: "0 0 4px",
              letterSpacing: -0.1,
            }}
          >
            Bersiap turun di Lebak Bulus
          </h2>
          <p style={{ fontSize: 13, fontWeight: 400, color: "#8E8E93", margin: "0 0 16px" }}>
            Estimasi 2 menit lagi
          </p>
          <button
            onClick={handleArrival}
            style={{
              width: "100%",
              height: 48,
              backgroundColor: "#2A9D6F",
              color: "white",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
            }}
          >
            Saya sudah tiba
          </button>
        </div>
      </BottomSheet>

      {/* Disruption Reroute Sheet */}
      <BottomSheet
        visible={showDisruptionSheet}
        height="medium"
        onDismiss={() => setShowDisruptionSheet(false)}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={16} color="#C9423A" strokeWidth={1.5} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1C1C1E", margin: 0 }}>
              Gangguan Terdeteksi
            </h3>
          </div>
          <p style={{ fontSize: 13, fontWeight: 400, color: "#3C3C43", margin: "0 0 20px", lineHeight: 1.5 }}>
            Keterlambatan 15 menit di jalur KRL Bogor. Rute alternatif via MRT tersedia.
          </p>
          <button
            onClick={() => { setShowDisruptionSheet(false); navigate("/detail-gangguan"); }}
            style={{
              width: "100%",
              height: 48,
              backgroundColor: "#1A6FBF",
              color: "white",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            Terima Rute Baru
          </button>
          <button
            onClick={() => setShowDisruptionSheet(false)}
            style={{
              width: "100%",
              height: 44,
              backgroundColor: "transparent",
              color: "#3C3C43",
              fontSize: 15,
              fontWeight: 400,
              fontFamily: "'Poppins', sans-serif",
              border: "none",
              cursor: "pointer",
            }}
          >
            Pertahankan Rute Lama
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
