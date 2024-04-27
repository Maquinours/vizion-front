import BusinessBlDetailsResponseDto from './BusinessBlDetailsResponseDto';

type BusinessBlResponseDto = {
  id: string;
  number: string;
  numBusiness: string;
  dateBL: string | undefined;
  valid: boolean;
  agence: string | null;
  deliverMode: string;
  numberOfPackage: number;
  weight: number;
  addressLineOne: string;
  addressLineTwo: string | null;
  fullName: string | null;
  zipCode: string;
  email: string | null;
  phoneNumber: string | null;
  enterpriseId: string;
  enterpriseName: string;
  numOrder: string;
  blDetailsList: BusinessBlDetailsResponseDto[];
  bom: boolean | null;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessBlResponseDto;
