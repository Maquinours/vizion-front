type ArcDetailRequestDto = {
  arcId: string;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  shippingServicePrice?: number | null;
  amountHtConfirmed?: number | null;
  shippingPriceConfirmed?: number | null;
  vat?: number | null;
};
export default ArcDetailRequestDto;
