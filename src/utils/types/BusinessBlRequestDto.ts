import BusinessBlDetailsRequestDto from './BusinessBlDetailsRequestDto';

type BusinessBlRequestDto = {
  number?: string | null;
  numBusiness: string;
  valid?: boolean | null;
  agence?: string | null;
  deliverMode?: string | null;
  numberOfPackage?: number | null;
  weight?: number | null;
  addressLineOne?: string | null;
  addressLineTwo?: string | null;
  fullName: string;
  zipCode?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  enterpriseId?: string | null;
  businessId?: string | null;
  enterpriseName?: string | null;
  blDetailsList?: Array<BusinessBlDetailsRequestDto> | null;
  bom?: boolean | null;
};

export default BusinessBlRequestDto;
