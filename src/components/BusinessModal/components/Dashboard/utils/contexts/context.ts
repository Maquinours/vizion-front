import { UseFormSetValue } from 'react-hook-form';
import { BusinessDashboardFormType } from '../../Dashboard';
import { createContext } from 'react';

type BusinessDashboardContextType = {
  setValue: UseFormSetValue<BusinessDashboardFormType>;
};

export const BusinessDashboardContext = createContext<BusinessDashboardContextType | null>(null);
