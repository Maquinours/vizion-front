type QuotationDetailRequestDto = {
  quoteId: string;
  subQuoteId: string;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  shippingServicePrice?: number | null;
};

export default QuotationDetailRequestDto;
