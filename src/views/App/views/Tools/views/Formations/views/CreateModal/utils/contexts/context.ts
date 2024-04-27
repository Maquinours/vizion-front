import { createContext } from 'react';
import ProfileResponseDto from '../../../../../../../../../../utils/types/ProfileResponseDto';

export type FormationDetail = { title: string; formationDate: string; startTime: string; endTime: string; trainers: Array<ProfileResponseDto> };

type FormationDetails = Array<FormationDetail>;

type FormationDetailsContextType = {
  details: FormationDetails;
  setDetails: (details: FormationDetails) => void;
};

export const FormationDetailsContext = createContext<FormationDetailsContextType | null>(null);
