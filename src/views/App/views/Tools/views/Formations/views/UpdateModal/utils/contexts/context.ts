import { createContext } from 'react';

export type FormationDetail = { title: string; formationDate: string; startTime: string; endTime: string; trainers: Array<{ id: string; name: string }> };

type FormationDetails = Array<FormationDetail>;

type FormationDetailsContextType = {
  details: FormationDetails;
  setDetails: (details: FormationDetails) => void;
};

export const UpdateFormationDetailsContext = createContext<FormationDetailsContextType | null>(null);
