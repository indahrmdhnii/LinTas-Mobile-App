import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SnackbarData {
  message: string;
  type: "default" | "success" | "error";
}

interface AppContextType {
  isGuest: boolean;
  setIsGuest: (v: boolean) => void;
  snackbar: SnackbarData | null;
  showSnackbar: (message: string, type?: "default" | "success" | "error") => void;
  clearSnackbar: () => void;
  hasSeenTutorial: boolean;
  showTutorial: boolean;
  triggerTutorial: () => void;
  dismissTutorial: () => void;
}

const AppContext = createContext<AppContextType>({
  isGuest: false,
  setIsGuest: () => {},
  snackbar: null,
  showSnackbar: () => {},
  clearSnackbar: () => {},
  hasSeenTutorial: false,
  showTutorial: false,
  triggerTutorial: () => {},
  dismissTutorial: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarData | null>(null);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const showSnackbar = useCallback(
    (message: string, type: "default" | "success" | "error" = "default") => {
      setSnackbar({ message, type });
      setTimeout(() => setSnackbar(null), 3000);
    },
    []
  );

  const clearSnackbar = useCallback(() => {
    setSnackbar(null);
  }, []);

  const triggerTutorial = useCallback(() => {
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [hasSeenTutorial]);

  const dismissTutorial = useCallback(() => {
    setShowTutorial(false);
    setHasSeenTutorial(true);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isGuest,
        setIsGuest,
        snackbar,
        showSnackbar,
        clearSnackbar,
        hasSeenTutorial,
        showTutorial,
        triggerTutorial,
        dismissTutorial,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
