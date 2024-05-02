import BusinessQuotationDetailsRequestDto from './BusinessQuotationDetailsRequestDto';

type BusinessSubQuotationRequestDto = {
  quotationId?: string | null;
  name?: string | null;
  orderNum?: string | null;
  quotationDetails?: BusinessQuotationDetailsRequestDto[] | null;
};

export default BusinessSubQuotationRequestDto;
