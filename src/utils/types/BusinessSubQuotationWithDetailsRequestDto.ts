import BusinessQuotationDetailsRequestDto from './BusinessQuotationDetailsRequestDto';

type BusinessSubQuotationWithDetailsRequestDto = {
  quotationId?: string | null;
  name?: string | null;
  orderNum?: string | null;
  quotationDetails?: BusinessQuotationDetailsRequestDto[] | null;
};

export default BusinessSubQuotationWithDetailsRequestDto;
