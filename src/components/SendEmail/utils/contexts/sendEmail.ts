import { createContext } from 'react';
import { Control, FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { SendEmailFormSchema } from '../../SendEmail';

type SendEmailFormContextType = Readonly<{
  control: Control<SendEmailFormSchema>;
  register: UseFormRegister<SendEmailFormSchema>;
  errors: FieldErrors<SendEmailFormSchema>;
  getValues: UseFormGetValues<SendEmailFormSchema>;
  setValue: UseFormSetValue<SendEmailFormSchema>;
}>;

export const SendEmailFormContext = createContext<SendEmailFormContextType | undefined>(undefined);
