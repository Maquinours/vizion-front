import BusinessBpDetailsResponseDto from './BusinessBpDetailsResponseDto';

type BusinessBpResponseDto = {
  id: string;
  number: string;
  globalPrep: number;
  dateBp: Date | null;
  shippingServicePrice: number;
  vat: number | null;
  totalAmount: number | null;
  totalAmountHt: number | null;
  numOrder: string;
  bpDetailsList: BusinessBpDetailsResponseDto[]; // TODO: change backend to return this data
  bom: boolean | null;
  totalWeight: number;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessBpResponseDto;
