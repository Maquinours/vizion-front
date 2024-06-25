import BusinessResponseDto from './BusinessResponseDto';

type SynopticResponseDto = {
  id: string;
  name: string | null;
  num: string | null;
  businessPtic: BusinessResponseDto | null;
  businessQuotationNumber: string | null;
  businessNumber: string | null;
  vizeo: boolean;
  vizeoptik: boolean;
  synopticList: Record<string, unknown> | null;
  enterpriseId: string;
  enterpriseName: string;
  profileId: string | null;
  profileName: string | null;
  profileEmail: string | null;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default SynopticResponseDto;
