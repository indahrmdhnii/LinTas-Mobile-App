import { Outlet, useLocation } from "react-router";
import { useAppContext } from "./context/AppContext";
import { Snackbar } from "./components/Snackbar";
import { NetworkStatusBanner } from "./components/NetworkStatusBanner";
import { OnboardingTutorial } from "./components/OnboardingTutorial";

export function Root() {
  const location = useLocation();
  const { snackbar } = useAppContext();

  // Routes where status bar text should be white (blue/dark background at top)
  const whiteStatusBar = ["/", "/route-search", "/voice-command"].includes(
    location.pathname
  );
  const statusColor = whiteStatusBar ? "#FFFFFF" : "#1C1C1E";

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center py-8">
      <div
        className="relative overflow-hidden bg-[#F7F7F5]"
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          boxShadow:
            "0 0 0 12px #1C1C1E, 0 30px 80px rgba(0,0,0,0.4), inset 0 0 0 2px #3C3C43",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Status Bar */}
        <div
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
          style={{ height: 44 }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: statusColor,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            9:41
          </span>
          <div className="flex items-center gap-1.5" style={{ color: statusColor }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
              <rect x="0" y="3" width="3" height="9" rx="1" opacity="0.3" />
              <rect x="4.5" y="2" width="3" height="10" rx="1" opacity="0.5" />
              <rect x="9" y="1" width="3" height="11" rx="1" opacity="0.7" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <path d="M8 3a7 7 0 0 1 5 2.1L14.4 3.7A9 9 0 0 0 8 1 9 9 0 0 0 1.6 3.7L3 5.1A7 7 0 0 1 8 3z" />
              <path d="M8 6a4 4 0 0 1 2.8 1.2L12.2 5.8A6 6 0 0 0 8 4a6 6 0 0 0-4.2 1.8l1.4 1.4A4 4 0 0 1 8 6z" />
              <circle cx="8" cy="10" r="2" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="21"
                height="11"
                rx="3.5"
                stroke="currentColor"
                strokeOpacity="0.35"
              />
              <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
              <path d="M23 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Screen content */}
        <div
          className="absolute inset-0 overflow-hidden flex flex-col"
          style={{ top: 44 }}
        >
          <NetworkStatusBanner />
          <div className="flex-1 overflow-hidden relative">
            <Outlet />
            <OnboardingTutorial />
          </div>
        </div>

        {/* Global Snackbar */}
        <Snackbar
          visible={!!snackbar}
          message={snackbar?.message ?? ""}
          type={snackbar?.type ?? "default"}
        />

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-current opacity-20"
          style={{ width: 134, height: 5 }}
        />
      </div>
    </div>
  );
}