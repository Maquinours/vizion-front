import BusinessArcDetailsResponseDto from './BusinessArcDetailsResponseDto';

type BusinessArcResponseDto = {
  id: string;
  number: string | null;
  documentName: string;
  shippingServicePrice: number;
  vat: number;
  totalAmount: number | null;
  totalAmountHT: number | null;
  amountHtConfirmed: number | null;
  shippingPriceConfirmed: number | null;
  numOrder: string | null;
  arcDetailsList: BusinessArcDetailsResponseDto[] | null;
  bom: boolean | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessArcResponseDto;
