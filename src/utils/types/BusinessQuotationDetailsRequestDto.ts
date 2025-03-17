type BusinessQuotationDetailsRequestDto = {
  groupName: string;
  quoteId: string;
  subQuoteId: string;
  numDetails: string;
  productId?: string | null;
  productReference: string;
  quantity: number;
  productDesignation?: string | null;
  productDescription?: string | null;
  productName?: string | null;
  reduction?: number | null;
  publicUnitPrice: number;
  unitPrice: number;
  totalPrice: number;
  taxDEEE?: number | null;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  vat?: number | null;
  shippingServicePrice?: number | null;
  virtualQty?: boolean | null;
  bom?: boolean | null;
};

export default BusinessQuotationDetailsRequestDto;
