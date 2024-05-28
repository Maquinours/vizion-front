import { createContext } from 'react';
import { Control, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { AssistanceFormType } from '../../Assistance';

type AssistanceContextType = {
  register: UseFormRegister<AssistanceFormType>;
  control: Control<AssistanceFormType>;
  getValues: UseFormGetValues<AssistanceFormType>;
  setValue: UseFormSetValue<AssistanceFormType>;
  watch: UseFormWatch<AssistanceFormType>;
  update: () => void;
};

export const AssistanceContext = createContext<AssistanceContextType | null>(null);
