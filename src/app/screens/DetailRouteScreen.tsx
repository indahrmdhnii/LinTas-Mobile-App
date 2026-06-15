import { useNavigate } from "react-router";
import { ChevronLeft, MapPin, Train, Navigation, Clock, DollarSign } from "lucide-react";
import { TransitBadge } from "../components/TransitBadge";
import { DensityIndicator } from "../components/DensityIndicator";
import { motion } from "motion/react";

const steps = [
  {
    id: 1,
    type: "depart",
    icon: MapPin,
    iconColor: "#2A9D6F",
    title: "Bundaran HI",
    subtitle: "Titik keberangkatan",
    time: "07:30",
  },
  {
    id: 2,
    type: "transit",
    icon: Train,
    iconColor: "#1A6FBF",
    title: "Naik MRT — Arah Lebak Bulus",
    subtitle: "Masuk Pintu 2A, Peron 2 · 4 stasiun",
    time: "07:32",
    badge: "MRT" as const,
  },
  {
    id: 3,
    type: "walk",
    icon: null,
    iconColor: "#8E8E93",
    title: "Turun di Blok M",
    subtitle: "Jalan kaki 3 menit ke halte",
    time: "07:48",
  },
  {
    id: 4,
    type: "arrive",
    icon: MapPin,
    iconColor: "#C9423A",
    title: "Lebak Bulus",
    subtitle: "Estimasi tiba",
    time: "07:54",
  },
];

export function DetailRouteScreen() {
  const navigate = useNavigate();

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
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
          boxShadow: "0 1px 4px rgba(28,28,30,0.04)",
        }}
      >
        <button
          onClick={() => navigate("/route-search")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
        >
          <ChevronLeft size={24} color="#1C1C1E" strokeWidth={1.5} />
        </button>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#1C1C1E",
              margin: 0,
              letterSpacing: -0.1,
            }}
          >
            Bundaran HI → Lebak Bulus
          </h2>
          <p style={{ fontSize: 13, fontWeight: 400, color: "#8E8E93", margin: "2px 0 0" }}>
            Via MRT Jakarta
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 96 }}>
        {/* Route summary card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            margin: "16px 20px 0",
            padding: 16,
            boxShadow: "0 2px 8px rgba(28,28,30,0.06)",
            display: "flex",
            gap: 16,
          }}
        >
          {/* Duration */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
              <Clock size={16} color="#1A6FBF" strokeWidth={1.5} />
            </div>
            <p
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#1C1C1E",
                margin: "0 0 2px",
                letterSpacing: -0.2,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              28 mnt
            </p>
            <p style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93", margin: 0 }}>Durasi</p>
          </div>

          <div style={{ width: 1, backgroundColor: "#EEEEED" }} />

          {/* Mode */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
              <TransitBadge type="MRT" />
            </div>
            <p style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93", margin: "4px 0 0" }}>Moda</p>
          </div>

          <div style={{ width: 1, backgroundColor: "#EEEEED" }} />

          {/* Cost */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
              <DollarSign size={16} color="#2A9D6F" strokeWidth={1.5} />
            </div>
            <p
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "#1C1C1E",
                margin: "0 0 2px",
                letterSpacing: -0.1,
              }}
            >
              Rp 4.000
            </p>
            <p style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93", margin: 0 }}>Biaya</p>
          </div>
        </motion.div>

        {/* Kepadatan */}
        <div style={{ padding: "12px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 400, color: "#8E8E93" }}>Kepadatan:</span>
          <DensityIndicator level="rendah" />
        </div>

        {/* Timeline */}
        <div style={{ padding: "20px 20px 0" }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#8E8E93",
              textTransform: "uppercase",
              letterSpacing: 1,
              margin: "0 0 16px",
            }}
          >
            RENCANA PERJALANAN
          </p>

          <div style={{ position: "relative" }}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === steps.length - 1;
              const isActive = step.type === "transit";
              const isDestination = step.type === "arrive";

              return (
                <div
                  key={step.id}
                  style={{ display: "flex", gap: 16, position: "relative", paddingBottom: isLast ? 0 : 24 }}
                >
                  {/* Timeline dot & line */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                      width: 16,
                    }}
                  >
                    <div
                      style={{
                        width: isActive ? 14 : 12,
                        height: isActive ? 14 : 12,
                        borderRadius: "50%",
                        backgroundColor: isDestination
                          ? "#C9423A"
                          : isActive
                          ? "#1A6FBF"
                          : "#2A9D6F",
                        flexShrink: 0,
                        marginTop: 3,
                        border: isActive ? "2px solid #EAF4FF" : "none",
                        boxShadow: isActive ? "0 0 0 2px #1A6FBF" : "none",
                      }}
                    />
                    {!isLast && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          backgroundColor: isActive ? "#1A6FBF" : "#EEEEED",
                          marginTop: 4,
                          minHeight: 28,
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          {Icon && (
                            <Icon size={14} color={step.iconColor} strokeWidth={1.5} />
                          )}
                          <p
                            style={{
                              fontSize: isActive ? 16 : 15,
                              fontWeight: isActive ? 600 : isDestination ? 600 : 400,
                              color: "#1C1C1E",
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
                            fontWeight: 400,
                            color: "#8E8E93",
                            margin: 0,
                          }}
                        >
                          {step.subtitle}
                        </p>
                        {step.badge && (
                          <div style={{ marginTop: 6 }}>
                            <TransitBadge type={step.badge} />
                          </div>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: isActive ? "#1A6FBF" : "#3C3C43",
                          fontVariantNumeric: "tabular-nums",
                          marginLeft: 8,
                          flexShrink: 0,
                        }}
                      >
                        {step.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 20px 20px",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EEEEED",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <button
          onClick={() => navigate("/navigation")}
          style={{
            width: "100%",
            height: 52,
            backgroundColor: "#1A6FBF",
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            borderRadius: 16,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Navigation size={18} strokeWidth={1.5} />
          Mulai Navigasi
        </button>
        <button
          onClick={() => navigate("/route-search")}
          style={{
            width: "100%",
            height: 44,
            backgroundColor: "transparent",
            color: "#1A6FBF",
            fontSize: 15,
            fontWeight: 400,
            fontFamily: "'Poppins', sans-serif",
            border: "none",
            cursor: "pointer",
          }}
        >
          Pilih Rute Lain
        </button>
      </div>
    </div>
  );
}
