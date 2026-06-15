import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Trash2, Navigation, ChevronLeft, Home, Building2, Bookmark, Clock } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { TransitBadge } from "../components/TransitBadge";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";

const savedLocations = [
  { id: 1, icon: Home, label: "Rumah", address: "Kemang Raya No. 12", color: "#1A6FBF" },
  { id: 2, icon: Building2, label: "Kantor", address: "Sudirman Tower, Lantai 8", color: "#1A6FBF" },
];

const recentTrips = [
  { id: 1, transit: "MRT" as const, from: "Blok M", to: "Bundaran HI", date: "Kemarin", duration: "28 mnt" },
  { id: 2, transit: "KRL" as const, from: "Depok", to: "Gambir", date: "2 hari lalu", duration: "45 mnt" },
  { id: 3, transit: "TransJakarta" as const, from: "Kalideres", to: "Harmoni", date: "3 hari lalu", duration: "55 mnt" },
  { id: 4, transit: "MRT" as const, from: "Sudirman", to: "Lebak Bulus", date: "5 hari lalu", duration: "22 mnt" },
  { id: 5, transit: "KRL" as const, from: "Manggarai", to: "Bogor", date: "6 hari lalu", duration: "75 mnt" },
  { id: 6, transit: "LRT" as const, from: "Dukuh Atas", to: "Cawang", date: "1 minggu lalu", duration: "18 mnt" },
  { id: 7, transit: "TransJakarta" as const, from: "Blok M", to: "Senen", date: "1 minggu lalu", duration: "40 mnt" },
];

export function TersimpanScreen() {
  const navigate = useNavigate();
  const { showSnackbar } = useAppContext();
  const [trips, setTrips] = useState(recentTrips);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteTarget !== null) {
      setTrips((prev) => prev.filter((t) => t.id !== deleteTarget));
      setDeleteTarget(null);
      showSnackbar("Riwayat dihapus", "default");
    }
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
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
          boxShadow: "0 1px 4px rgba(28,28,30,0.04)",
        }}
      >
        <button
          onClick={() => navigate("/home")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
        >
          <ChevronLeft size={24} color="#1C1C1E" strokeWidth={1.5} />
        </button>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#1C1C1E",
            margin: 0,
            letterSpacing: -0.1,
          }}
        >
          Tersimpan & Riwayat
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 80 }}>
        {/* Kartu Cepat */}
        <div style={{ padding: "20px 20px 0" }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#8E8E93",
              textTransform: "uppercase",
              letterSpacing: 1,
              margin: "0 0 10px",
            }}
          >
            KARTU CEPAT
          </p>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(28,28,30,0.06)",
            }}
          >
            {savedLocations.map((loc, i) => {
              const Icon = loc.icon;
              return (
                <motion.div
                  key={loc.id}
                  whileTap={{ backgroundColor: "#F7F7F5" }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "14px 16px",
                    borderBottom: i < savedLocations.length - 1 ? "1px solid #EEEEED" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/route-search")}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "#EAF4FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={loc.color} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "#1C1C1E", margin: 0 }}>
                      {loc.label}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 400, color: "#8E8E93", margin: "2px 0 0" }}>
                      {loc.address}
                    </p>
                  </div>
                  <Navigation size={16} color="#1A6FBF" strokeWidth={1.5} />
                </motion.div>
              );
            })}

            {/* Add new */}
            <button
              style={{
                width: "100%",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "none",
                border: "none",
                borderTop: "1px solid #EEEEED",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "#F7F7F5",
                  border: "1.5px dashed #EEEEED",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={18} color="#8E8E93" strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 400, color: "#8E8E93" }}>
                Tambah Lokasi Baru
              </span>
            </button>
          </div>
        </div>

        {/* Riwayat Perjalanan */}
        <div style={{ padding: "24px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#8E8E93",
                textTransform: "uppercase",
                letterSpacing: 1,
                margin: 0,
              }}
            >
              RIWAYAT PERJALANAN
            </p>
            <span style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93" }}>7 terakhir</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <AnimatePresence>
              {trips.map((trip) => (
                <motion.div
                  key={trip.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0 }}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    padding: "14px 16px",
                    boxShadow: "0 2px 8px rgba(28,28,30,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                      style={{ flex: 1, cursor: "pointer" }}
                      onClick={() => navigate("/detail-route")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <TransitBadge type={trip.transit} />
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={12} color="#8E8E93" strokeWidth={1.5} />
                          <span style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93" }}>
                            {trip.duration}
                          </span>
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#1C1C1E",
                          margin: "0 0 2px",
                          letterSpacing: -0.1,
                        }}
                      >
                        {trip.from} → {trip.to}
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 400, color: "#8E8E93", margin: 0 }}>
                        {trip.date}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
                      <button
                        onClick={() => navigate("/route-search")}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          backgroundColor: "#EAF4FF",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Gunakan rute ini"
                      >
                        <Navigation size={16} color="#1A6FBF" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(trip.id)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          backgroundColor: "#FFEBEA",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Hapus"
                      >
                        <Trash2 size={16} color="#C9423A" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {trips.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <Bookmark size={40} color="#EEEEED" strokeWidth={1.5} style={{ margin: "0 auto 12px" }} />
                <p style={{ fontSize: 15, fontWeight: 400, color: "#8E8E93" }}>
                  Belum ada riwayat perjalanan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        visible={deleteTarget !== null}
        title="Hapus Riwayat?"
        description="Riwayat perjalanan ini akan dihapus permanen."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <BottomNav />
    </div>
  );
}
