import BusinessSubQuotationWithDetailsRequestDto from './BusinessSubQuotationWithDetailsRequestDto';

type BusinessQuotationRequestDto = {
  businessId?: string | null;
  number?: string | null;
  documentName?: string | null;
  shippingServicePrice?: number | null;
  vat?: number | null;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  subQuotationList?: BusinessSubQuotationWithDetailsRequestDto[] | null;
  bom?: boolean | null;
};

export default BusinessQuotationRequestDto;
