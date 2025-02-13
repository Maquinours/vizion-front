type EnterpriseAccountabilityResponseDto = {
  id: string;
  billingServiceName?: string;
  tvaNumber?: string;
  siren?: string;
  siret?: string;
  discount?: number;
  accountingEmail?: string;
  accountNumber?: string;
  createdDate: Date;
  modifiedDate?: Date;
  createdBy?: string;
  modifiedBy?: string;
};

export default EnterpriseAccountabilityResponseDto;
