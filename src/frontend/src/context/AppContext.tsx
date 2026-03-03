import { type ReactNode, createContext, useContext, useState } from "react";

export type RiskLevel = "Low" | "Moderate" | "High";

interface AppState {
  registrationId: string | null;
  participantName: string | null;
  preTestScore: number | null;
  postTestScore: number | null;
  riskLevel: RiskLevel | null;
  isAdmin: boolean;
  registrationDate: string | null;
}

interface AppContextValue extends AppState {
  setRegistrationId: (id: string) => void;
  setParticipantName: (name: string) => void;
  setPreTestScore: (score: number) => void;
  setPostTestScore: (score: number) => void;
  setRiskLevel: (level: RiskLevel) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setRegistrationDate: (date: string) => void;
  reset: () => void;
}

const defaultState: AppState = {
  registrationId: null,
  participantName: null,
  preTestScore: null,
  postTestScore: null,
  riskLevel: null,
  isAdmin: false,
  registrationDate: null,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const setRegistrationId = (id: string) =>
    setState((prev) => ({ ...prev, registrationId: id }));
  const setParticipantName = (name: string) =>
    setState((prev) => ({ ...prev, participantName: name }));
  const setPreTestScore = (score: number) =>
    setState((prev) => ({ ...prev, preTestScore: score }));
  const setPostTestScore = (score: number) =>
    setState((prev) => ({ ...prev, postTestScore: score }));
  const setRiskLevel = (level: RiskLevel) =>
    setState((prev) => ({ ...prev, riskLevel: level }));
  const setIsAdmin = (isAdmin: boolean) =>
    setState((prev) => ({ ...prev, isAdmin }));
  const setRegistrationDate = (date: string) =>
    setState((prev) => ({ ...prev, registrationDate: date }));
  const reset = () => setState(defaultState);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setRegistrationId,
        setParticipantName,
        setPreTestScore,
        setPostTestScore,
        setRiskLevel,
        setIsAdmin,
        setRegistrationDate,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
