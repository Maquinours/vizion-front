import { createContext } from 'react';
import { Tab } from '../../TabsContainer';

type TabsContextType = {
  removeTab: (tab?: Tab) => void;
  getCurrentTab: () => Tab | undefined;
  updateTabRoute: (tabId: string, callback: (tabRoute: Tab) => Tab['route']) => void;
};

export const TabsContext = createContext<TabsContextType | null>(null);
