import BusinessQuotationDetailsResponseDto from './BusinessQuotationDetailsResponseDto';

type BusinessSubQuotationResponseDto = {
  id: string;
  name: string;
  orderNum: string | null;
  quotationDetails: BusinessQuotationDetailsResponseDto[] | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessSubQuotationResponseDto;
