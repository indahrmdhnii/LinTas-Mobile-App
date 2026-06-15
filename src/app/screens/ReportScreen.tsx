import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, CalendarDays, MapPin, Wrench, MessageSquare, Loader } from "lucide-react";

const reportTypes = [
  {
    id: "schedule",
    icon: CalendarDays,
    label: "Akurasi Jadwal",
    desc: "Jadwal tidak sesuai kenyataan",
  },
  {
    id: "name",
    icon: MapPin,
    label: "Nama Tempat",
    desc: "Nama salah atau berubah",
  },
  {
    id: "condition",
    icon: Wrench,
    label: "Kondisi Fisik",
    desc: "Rusak, tutup, atau pindah",
  },
  {
    id: "general",
    icon: MessageSquare,
    label: "Saran Umum",
    desc: "Masukan bebas",
  },
];

const issueChips = ["Terlambat", "Dibatalkan", "Salah Info"];
const modaOptions = ["MRT", "KRL", "TransJakarta", "LRT", "JakLingko"];

export function ReportScreen() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedModa, setSelectedModa] = useState("MRT");
  const [selectedIssue, setSelectedIssue] = useState("Terlambat");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate("/sukses-laporan");
    }, 1200);
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
          boxShadow: "0 1px 4px rgba(28,28,30,0.04)",
        }}
      >
        <button onClick={() => navigate(-1 as any)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
          <ChevronLeft size={24} color="#1C1C1E" strokeWidth={1.5} />
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1C1C1E", margin: 0, letterSpacing: -0.1 }}>
          Laporkan Masalah
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F7F7F5", padding: "20px 20px 40px" }}>
        {/* Report types */}
        <p style={{ fontSize: 13, fontWeight: 500, color: "#8E8E93", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>
          JENIS LAPORAN
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {reportTypes.map((type) => {
            const Icon = type.icon;
            const selected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: selected ? "#EAF4FF" : "#FFFFFF",
                  border: selected ? "2px solid #1A6FBF" : "1px solid #EEEEED",
                  boxShadow: "0 1px 4px rgba(28,28,30,0.04)",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <Icon size={24} color={selected ? "#1A6FBF" : "#8E8E93"} strokeWidth={1.5} />
                <p style={{ fontSize: 15, fontWeight: 600, color: selected ? "#1A6FBF" : "#1C1C1E", margin: 0 }}>
                  {type.label}
                </p>
                <p style={{ fontSize: 11, fontWeight: 400, color: selected ? "#1A6FBF" : "#8E8E93", margin: 0 }}>
                  {type.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Form (conditional) */}
        {selectedType && (
          <>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#8E8E93", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>
                DETAIL LAPORAN
              </p>
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {/* Moda Transit */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#3C3C43", display: "block", marginBottom: 8 }}>
                    Moda Transit
                  </label>
                  <select
                    value={selectedModa}
                    onChange={(e) => setSelectedModa(e.target.value)}
                    style={{
                      width: "100%",
                      height: 52,
                      border: "1px solid #EEEEED",
                      borderRadius: 12,
                      padding: "0 16px",
                      fontSize: 15,
                      fontFamily: "'Poppins', sans-serif",
                      color: "#1C1C1E",
                      backgroundColor: "#FFFFFF",
                      appearance: "none",
                      outline: "none",
                    }}
                  >
                    {modaOptions.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Route */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#3C3C43", display: "block", marginBottom: 8 }}>
                    Rute atau Jalur
                  </label>
                  <input
                    placeholder="cth. Lebak Bulus Line"
                    defaultValue="Lebak Bulus Line"
                    style={{
                      width: "100%",
                      height: 52,
                      border: "1px solid #EEEEED",
                      borderRadius: 12,
                      padding: "0 16px",
                      fontSize: 15,
                      fontFamily: "'Poppins', sans-serif",
                      color: "#1C1C1E",
                      backgroundColor: "#FFFFFF",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Issue type */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#3C3C43", display: "block", marginBottom: 8 }}>
                    Jenis Masalah
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {issueChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => setSelectedIssue(chip)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 100,
                          border: selectedIssue === chip ? "2px solid #1A6FBF" : "1.5px solid #EEEEED",
                          backgroundColor: selectedIssue === chip ? "#EAF4FF" : "transparent",
                          color: selectedIssue === chip ? "#1A6FBF" : "#3C3C43",
                          fontSize: 13,
                          fontWeight: 500,
                          fontFamily: "'Poppins', sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#3C3C43", display: "block", marginBottom: 8 }}>
                    Catatan Tambahan (opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                    placeholder="Tulis catatan di sini..."
                    rows={3}
                    style={{
                      width: "100%",
                      border: "1px solid #EEEEED",
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 15,
                      fontFamily: "'Poppins', sans-serif",
                      color: "#1C1C1E",
                      backgroundColor: "#FFFFFF",
                      outline: "none",
                      resize: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: 11, fontWeight: 400, color: "#8E8E93", textAlign: "right", margin: "4px 0 0" }}>
                    {notes.length} / 500 karakter
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div
              style={{
                backgroundColor: "#EAF4FF",
                borderRadius: 12,
                padding: 16,
                marginTop: 16,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1A6FBF", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>
                RINGKASAN LAPORAN
              </p>
              {[
                { label: "Moda", value: selectedModa },
                { label: "Masalah", value: `${selectedIssue} 15 menit` },
                { label: "Rute", value: "Lebak Bulus Line" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#8E8E93", minWidth: 60 }}>{row.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 400, color: "#1C1C1E" }}>{row.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: "100%",
                height: 52,
                backgroundColor: submitting ? "#8E8E93" : "#1A6FBF",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                borderRadius: 16,
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {submitting ? (
                <>
                  <Loader size={18} strokeWidth={1.5} style={{ animation: "spin 1s linear infinite" }} />
                  Mengirim...
                </>
              ) : (
                "Kirim Laporan"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}