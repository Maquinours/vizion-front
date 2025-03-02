type EnterpriseAccountabilityRequestDto = {
  billingServiceName?: string | null;
  tvaNumber?: string | null;
  siren?: string | null;
  siret?: string | null;
  accountNumber?: string | null;
  discount?: number | null;
  accountingEmail?: string | null;
};

export default EnterpriseAccountabilityRequestDto;
