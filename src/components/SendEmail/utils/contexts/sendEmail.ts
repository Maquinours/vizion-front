import { createContext } from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { SendEmailFormSchema } from '../../SendEmail';

type SendEmailFormContextType = Readonly<{
  control: Control<SendEmailFormSchema>;
  register: UseFormRegister<SendEmailFormSchema>;
  errors: FieldErrors<SendEmailFormSchema>;
  watch: UseFormWatch<SendEmailFormSchema>;
  setValue: UseFormSetValue<SendEmailFormSchema>;
}>;

export const SendEmailFormContext = createContext<SendEmailFormContextType | undefined>(undefined);
