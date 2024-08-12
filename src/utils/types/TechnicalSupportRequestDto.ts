import TechnicalSupportRecapOptionRequestDto from './TechnicalSupportRecapOptionRequestDto';

type TechnicalSupportRequestDto = {
  name?: string | null;
  enterpriseId?: string | null;
  enterpriseName?: string | null;
  businessNum?: string | null;
  predefinedTime?: string | null;
  cumulatedTime?: string | null;
  noBilledTime?: string | null;
  recaps?: Array<Omit<TechnicalSupportRecapOptionRequestDto, 'supportId'>> | null;
};

export default TechnicalSupportRequestDto;
