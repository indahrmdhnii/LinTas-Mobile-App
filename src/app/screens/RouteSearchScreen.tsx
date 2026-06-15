import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, MapPin, ArrowUpDown, Clock, RefreshCw, Users, Navigation } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { TransitBadge, StatusChip, LabelChip } from "../components/TransitBadge";
import { motion, AnimatePresence } from "motion/react";

const suggestions = [
  { type: "history", name: "Stasiun Sudirman", sub: "MRT Jakarta  ·  1.2 km" },
  { type: "history", name: "Stasiun Blok M", sub: "MRT Jakarta  ·  2.4 km" },
  { type: "location", name: "Bundaran HI", sub: "MRT Jakarta  ·  1.8 km" },
  { type: "location", name: "Stasiun Gambir", sub: "KRL Commuter  ·  3.1 km" },
];

interface RouteOption {
  id: number;
  label?: string;
  labelColor?: string;
  duration: string;
  via: string;
  transit: "MRT" | "KRL" | "TransJakarta" | "LRT" | "JakLingko";
  walk?: string;
  density: string;
  densityColor: string;
  price: string;
  highlighted?: boolean;
}

const routes: RouteOption[] = [
  {
    id: 1,
    label: "Tercepat",
    labelColor: "#1A6FBF",
    duration: "28 mnt",
    via: "MRT  →  Jalan Kaki",
    transit: "MRT",
    walk: "3 mnt jalan",
    density: "Rendah",
    densityColor: "#2A9D6F",
    price: "Rp 4.000",
    highlighted: true,
  },
  {
    id: 2,
    label: "Termudah",
    labelColor: "#2A9D6F",
    duration: "35 mnt",
    via: "TransJakarta Langsung",
    transit: "TransJakarta",
    density: "Sedang",
    densityColor: "#D97B2A",
    price: "Rp 3.500",
  },
  {
    id: 3,
    label: "Termurah",
    labelColor: "#2A9D6F",
    duration: "42 mnt",
    via: "KRL  →  Angkot",
    transit: "KRL",
    density: "Tinggi",
    densityColor: "#C9423A",
    price: "Rp 3.000",
  },
];

export function RouteSearchScreen() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (name: string) => {
    setDestination(name);
    setShowSuggestions(false);
    setShowResults(true);
  };

  return (
    <div className="h-full flex flex-col" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Blue header */}
      <div
        style={{
          backgroundColor: "#1A6FBF",
          padding: "16px 20px 20px",
          flexShrink: 0,
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => navigate("/home")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
          >
            <ChevronLeft size={24} color="white" strokeWidth={1.5} />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "white", margin: 0, letterSpacing: -0.1 }}>
            Cari Rute
          </h2>
        </div>

        {/* Input fields */}
        <div style={{ position: "relative" }}>
          {/* From input */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: "12px 16px",
              boxShadow: "0 2px 8px rgba(28,28,30,0.06)",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <MapPin size={16} color="#2A9D6F" strokeWidth={1.5} style={{ marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 400, color: "#1C1C1E", margin: 0 }}>Lokasi saat ini (GPS)</p>
              <p style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93", margin: "2px 0 0" }}>Dideteksi otomatis</p>
            </div>
          </div>

          {/* Vertical connector */}
          <div
            style={{
              position: "absolute",
              left: 23,
              top: 52,
              width: 2,
              height: 10,
              borderLeft: "2px dashed #EEEEED",
            }}
          />

          {/* To input */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: "12px 16px",
              boxShadow: "0 2px 8px rgba(28,28,30,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: showSuggestions ? "2px solid #1A6FBF" : "1px solid transparent",
            }}
          >
            <MapPin size={16} color="#C9423A" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Tujuan..."
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(e.target.value.length > 0 || true);
                setShowResults(false);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 15,
                fontFamily: "'Poppins', sans-serif",
                color: destination ? "#1C1C1E" : "#8E8E93",
                backgroundColor: "transparent",
              }}
            />
          </div>

          {/* Swap button */}
          <button
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              backgroundColor: "#F7F7F5",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpDown size={16} color="#3C3C43" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F7F7F5", paddingBottom: 80 }}>
        {/* Autocomplete suggestions */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                backgroundColor: "#FFFFFF",
                margin: "12px 16px 0",
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(28,28,30,0.10)",
                overflow: "hidden",
              }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSearch(s.name)}
                  style={{
                    width: "100%",
                    height: 52,
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: i < suggestions.length - 1 ? "1px solid #EEEEED" : "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {s.type === "history" ? (
                    <Clock size={16} color="#8E8E93" strokeWidth={1.5} />
                  ) : (
                    <MapPin size={16} color="#8E8E93" strokeWidth={1.5} />
                  )}
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 400, color: "#1C1C1E", margin: 0, fontFamily: "'Poppins', sans-serif" }}>{s.name}</p>
                    <p style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93", margin: 0, fontFamily: "'Poppins', sans-serif" }}>{s.sub}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Route results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: "20px 20px 0" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1C1C1E", margin: 0, letterSpacing: -0.1 }}>3 Rute Ditemukan</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <RefreshCw size={12} color="#8E8E93" strokeWidth={1.5} />
                    <span style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93" }}>Diperbarui 30 dtk lalu</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {routes.map((route) => (
                  <motion.div
                    key={route.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/detail-route")}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 16,
                      padding: 16,
                      boxShadow: "0 2px 8px rgba(28,28,30,0.06)",
                      cursor: "pointer",
                      borderLeft: route.highlighted ? "3px solid #1A6FBF" : "none",
                    }}
                  >
                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <TransitBadge type={route.transit} />
                        {route.walk && (
                          <span
                            style={{
                              backgroundColor: "#F7F7F5",
                              color: "#3C3C43",
                              fontSize: 11,
                              fontWeight: 500,
                              fontFamily: "'Poppins', sans-serif",
                              padding: "3px 10px",
                              borderRadius: 100,
                            }}
                          >
                            {route.walk}
                          </span>
                        )}
                      </div>
                      {route.label && (
                        <LabelChip
                          label={route.label}
                          bg={route.labelColor === "#1A6FBF" ? "#EAF4FF" : "#E8F8F2"}
                          color={route.labelColor}
                        />
                      )}
                    </div>

                    {/* Duration */}
                    <p style={{ fontSize: 28, fontWeight: 600, color: "#1C1C1E", margin: "0 0 4px", letterSpacing: -0.3, fontVariantNumeric: "tabular-nums" }}>
                      {route.duration}
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 400, color: "#3C3C43", margin: "0 0 12px" }}>
                      {route.via}
                    </p>

                    {/* Divider */}
                    <div style={{ height: 1, backgroundColor: "#EEEEED", margin: "0 0 10px" }} />

                    {/* Density */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Users size={12} color="#8E8E93" strokeWidth={1.5} />
                      <span style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93" }}>Kepadatan: </span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: route.densityColor }}>{route.density}</span>
                      <span style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93", marginLeft: "auto" }}>{route.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Start Navigation */}
              <button
                onClick={() => navigate("/detail-route")}
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
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                Mulai Navigasi
                <Navigation size={20} strokeWidth={1.5} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!showResults && !showSuggestions && (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <MapPin size={40} color="#EEEEED" strokeWidth={1.5} style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: 15, fontWeight: 400, color: "#8E8E93" }}>
              Masukkan tujuan untuk mencari rute
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}