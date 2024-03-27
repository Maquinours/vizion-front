type ProductVersionRequestDto = {
  reference: string;
  providerId?: string | null;
  providerName?: string | null;
  purchasePriceUSD?: number | null;
  purchasePriceEUR?: number | null;
  shippingService?: number | null;
  margin?: number | null;
  customsTax?: number | null;
  ecoTaxDEEE?: number | null;
  publicPrice?: number | null;
  productId?: string | null;
  productReference?: string | null;
  vizeo?: boolean | null;
  qty?: number | null;
  virtualQty?: boolean | null;
  bom?: boolean | null;
};

export default ProductVersionRequestDto;
