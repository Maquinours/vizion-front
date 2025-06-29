import { createContext } from 'react';

type AircallWorkspaceContextType = {
  dialNumber: (number: string) => Promise<void>;
  isLoggedIn: (callback: (loggedIn: boolean) => void) => void;
};

export const AircallWorkspaceContext = createContext<AircallWorkspaceContextType | null>(null);
