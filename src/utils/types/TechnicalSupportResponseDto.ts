type TechnicalSupportResponseDto = {
  id: string;
  enterpriseId: string | null;
  enterpriseName: string | null;
  name: string;
  businessNumber: string | null;
  businessId: string | null;
  businessTitle: string | null;
  predefinedTime: string | null;
  cumulatedTime: string | null;
  noBilledTime: string;
  createdDate: string;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default TechnicalSupportResponseDto;
