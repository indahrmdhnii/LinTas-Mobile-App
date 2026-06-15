import { useNavigate } from "react-router";
import { ChevronLeft, Bookmark, DoorOpen, Train, RefreshCw, Users, Navigation, Flag } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { TransitBadge, StatusChip } from "../components/TransitBadge";
import { useAppContext } from "../context/AppContext";

const departures = [
  { id: 1, direction: "Arah Lebak Bulus", eta: "3 mnt", status: "on-time" as const, density: 3, densityColor: "#C9423A", densityLabel: "Penuh" },
  { id: 2, direction: "Arah Bundaran HI", eta: "8 mnt", status: "on-time" as const, density: 2, densityColor: "#D97B2A", densityLabel: "Sedang" },
  { id: 3, direction: "Arah Lebak Bulus", eta: "14 mnt", status: "on-time" as const, density: 1, densityColor: "#2A9D6F", densityLabel: "Rendah" },
  { id: 4, direction: "Arah Bundaran HI", eta: "19 mnt", status: "on-time" as const, density: 1, densityColor: "#2A9D6F", densityLabel: "Rendah" },
];

export function StationScreen() {
  const navigate = useNavigate();
  const { showSnackbar } = useAppContext();

  return (
    <div
      className="h-full flex flex-col"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Blue header */}
      <div
        style={{
          backgroundColor: "#1A6FBF",
          padding: "12px 20px 20px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button
            onClick={() => navigate("/home")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <ChevronLeft size={24} color="white" strokeWidth={1.5} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
            onClick={() => {
              showSnackbar("Stasiun Sudirman disimpan", "success");
            }}
          >
            <Bookmark size={24} color="white" strokeWidth={1.5} />
          </button>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 600, color: "white", margin: "0 0 4px", letterSpacing: -0.2 }}>
          Stasiun Sudirman
        </h1>
        <p style={{ fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.7)", margin: "0 0 16px" }}>
          MRT Jakarta  ·  Lebak Bulus Line
        </p>

        {/* Info chips */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { icon: DoorOpen, label: "Pintu 2A" },
            { icon: Train, label: "Peron 2" },
          ].map((chip, i) => {
            const Icon = chip.icon;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 100,
                  padding: "6px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Icon size={14} color="white" strokeWidth={1.5} />
                <span style={{ fontSize: 13, fontWeight: 500, color: "white" }}>{chip.label}</span>
              </div>
            );
          })}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 100,
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 500, color: "white" }}>Akses ada</span>
          </div>
        </div>
      </div>

      {/* Departures */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: "#F7F7F5", padding: "20px 20px 0", paddingBottom: 80 }}
      >
        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#8E8E93", textTransform: "uppercase", letterSpacing: 1 }}>
            KEBERANGKATAN BERIKUTNYA
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <RefreshCw size={12} color="#8E8E93" strokeWidth={1.5} />
            <span style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93" }}>30 dtk</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {departures.map((dep, i) => (
            <div
              key={dep.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                padding: "14px 16px",
                boxShadow: "0 2px 8px rgba(28,28,30,0.06)",
                opacity: i > 1 ? 0.65 : 1,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <TransitBadge type="MRT" />
                  <span style={{ fontSize: 15, fontWeight: 400, color: "#1C1C1E" }}>{dep.direction}</span>
                </div>
                <div style={{ display: "flex", flex: "column", gap: 6, alignItems: "flex-end" }}>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: "#1C1C1E",
                      margin: "0 0 4px",
                      letterSpacing: -0.2,
                      fontVariantNumeric: "tabular-nums",
                      textAlign: "right",
                    }}
                  >
                    {dep.eta}
                  </p>
                  <StatusChip status={dep.status} />
                </div>
              </div>

              {/* Density */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3].map((seg) => (
                    <div
                      key={seg}
                      style={{
                        width: 20,
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: seg <= dep.density ? dep.densityColor : "#EEEEED",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 11, fontWeight: 400, color: dep.densityColor }}>{dep.densityLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            onClick={() => showSnackbar("Stasiun Sudirman disimpan", "success")}
            style={{
              flex: 1,
              height: 52,
              backgroundColor: "#FFFFFF",
              color: "#1A6FBF",
              fontSize: 15,
              fontWeight: 400,
              fontFamily: "'Poppins', sans-serif",
              borderRadius: 16,
              border: "1.5px solid #1A6FBF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Bookmark size={20} strokeWidth={1.5} />
            Simpan
          </button>
          <button
            onClick={() => navigate("/route-search")}
            style={{
              flex: 1,
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
            <Navigation size={20} strokeWidth={1.5} />
            Buat Rute
          </button>
        </div>

        {/* Laporkan Masalah */}
        <div style={{ textAlign: "center", marginTop: 16, paddingBottom: 24 }}>
          <button
            onClick={() => navigate("/report")}
            style={{
              background: "none",
              border: "none",
              fontSize: 13,
              fontWeight: 500,
              color: "#8E8E93",
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              margin: "0 auto",
            }}
          >
            <Flag size={14} strokeWidth={1.5} />
            Laporkan Masalah
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}