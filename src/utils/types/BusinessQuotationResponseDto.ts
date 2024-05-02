import BusinessSubQuotationResponseDto from './BusinessSubQuotationResponseDto';

type BusinessQuotationResponseDto = {
  id: string;
  number: string;
  documentName: string | null;
  shippingServicePrice: number;
  vat: number;
  totalAmount: number | null;
  totalAmountHT: number | null;
  subQuotationList: BusinessSubQuotationResponseDto[] | null;
  bom: boolean | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessQuotationResponseDto;
