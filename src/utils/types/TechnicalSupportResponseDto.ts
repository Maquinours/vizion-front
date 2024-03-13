type TechnicalSupportResponseDto = {
  id: string;
  enterpriseId: string | null;
  enterpriseName: string | null;
  name: string;
  businessNumber: string | null;
  businessId: string | null;
  businessTitle: string | null;
  predefinedTime: Date | null; // TODO: Check if this is a Date or a string
  cumulativeTime: Date | null;
  noBilledTime: Date;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default TechnicalSupportResponseDto;
