import BusinessSubQuotationRequestDto from './BusinessSubQuotationRequestDto';

type BusinessQuotationRequestDto = {
  businessId?: string | null;
  number?: string | null;
  documentName?: string | null;
  shippingServicePrice?: number | null;
  vat?: number | null;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  subQuotationList?: BusinessSubQuotationRequestDto[] | null;
  bom?: boolean | null;
};

export default BusinessQuotationRequestDto;
