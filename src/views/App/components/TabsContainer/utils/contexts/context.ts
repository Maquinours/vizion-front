import { createContext } from 'react';
import { Tab } from '../../TabsContainer';

type TabsContextType = {
  removeTab: (tab?: Tab) => void;
};

export const TabsContext = createContext<TabsContextType | null>(null);
