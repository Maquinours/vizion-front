type ProductRequestDto = {
  name: string;
  reference: string;
  shortDescription: string;
  description?: string | null;
  providerId?: string | null;
  providerName?: string | null;
  purchasePriceUSD?: number | null;
  purchasePriceEUR?: number | null;
  shippingService?: number | null;
  margin?: number | null;
  customsTax?: number | null;
  ecoTaxDEEE?: number | null;
  publicPrice: number;
  productCategoryName?: string | null;
  assistanceTime?: number | null;
  vizeo?: boolean | null;
  qty?: number | null;
  virtualQty?: boolean | null;
  bom?: boolean | null;
};

export default ProductRequestDto;
