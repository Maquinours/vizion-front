type QuotationDetailRequestDto = {
  quoteId: string;
  subQuoteId: string;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  shippingServicePrice?: number | null;
  vat?: number | null;
};

export default QuotationDetailRequestDto;
