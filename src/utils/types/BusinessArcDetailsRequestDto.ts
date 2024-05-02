type BusinessArcDetailsRequestDto = {
  arcId?: string | null;
  numDetails?: string | null;
  productId?: string | null;
  productReference?: string | null;
  quantity?: number | null;
  productDesignation?: string | null;
  productDescription?: string | null;
  productName?: string | null;
  reduction?: number | null;
  publicUnitPrice?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
  taxDEEE?: number | null;
  stock?: boolean | null;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  shippingServicePrice?: number | null;
  virtualQty?: boolean | null;
  bom?: boolean | null;
  availableDate?: string | null;
  amountHtConfirmed?: number | null;
  shippingPriceConfirmed?: number | null;
};

export default BusinessArcDetailsRequestDto;
