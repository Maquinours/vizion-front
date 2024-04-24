import BusinessArcDetailsRequestDto from './BusinessArcDetailsRequestDto';

type BusinessArcRequestDto = {
  amountHtConfirmed?: number | null;
  shippingPriceConfirmed?: number | null;
  number?: string | null;
  documentName?: string | null;
  shippingServicePrice?: number | null;
  vat?: number | null;
  numOrder?: string | null;
  businessId?: string | null;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  arcDetailsList?: BusinessArcDetailsRequestDto[] | null;
  bom?: boolean | null;
};

export default BusinessArcRequestDto;
