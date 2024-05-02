import React, { createContext } from 'react';
import { BusinessCreditDetails, BusinessCreditRow } from '../../Credit';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';
import BusinessBillResponseDto from '../../../../../../../../utils/types/BusinessBillResponseDto';

type CreditContextType = {
  details: BusinessCreditDetails | undefined;
  setDetails: React.Dispatch<React.SetStateAction<BusinessCreditDetails | undefined>>;
  shippingServicePrice: number;
  business: BusinessResponseDto | undefined;
  items: Array<BusinessCreditRow>;
  enterprise: EnterpriseResponseDto | undefined;
  bill: BusinessBillResponseDto | undefined;
};

export const CreditContext = createContext<CreditContextType | undefined>(undefined);
