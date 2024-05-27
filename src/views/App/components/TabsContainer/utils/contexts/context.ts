import { createContext } from 'react';

type TabsContextType = {
  removeTab: (tabId?: string) => void;
};

export const TabsContext = createContext<TabsContextType | null>(null);
