import React, { createContext } from 'react';
import ProfileAgencyRequestDto from '../../../../../../../../../../utils/types/ProfileAgencyRequestDto';

type ContactRequestDto = Omit<ProfileAgencyRequestDto, 'categoryClient'>;

type CreateEnterpriseContext = {
  contacts: Array<ContactRequestDto>;
  setContacts: React.Dispatch<React.SetStateAction<Array<ContactRequestDto>>>;
};

export const CreateEnterpriseContext = createContext<CreateEnterpriseContext | null>(null);
