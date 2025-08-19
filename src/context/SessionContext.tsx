import React, { createContext, useContext, ReactNode } from 'react';
import { useSessionManagement } from '../hooks/useSessionManagement';
import { Session } from '../types/Session';

interface SessionContextType {
  sessions: Session[];
  dailyTotals: { [date: string]: { totalFocus: number, totalBreak: number } };
  handleSessionEnd: (session: Session) => void;
  handleImportSessions: (newSessions: Session[]) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { sessions, dailyTotals, handleSessionEnd, handleImportSessions } = useSessionManagement();

  return (
    <SessionContext.Provider value={{ sessions, dailyTotals, handleSessionEnd, handleImportSessions }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
