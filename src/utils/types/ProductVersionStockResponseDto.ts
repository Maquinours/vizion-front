type ProductVersionStockResponseDto = {
  id: string;
  productId: string | null;
  productVersionId: string | null;
  providerId: string | null;
  providerName: string | null;
  reference: string | null;
  productVersionRef: string | null;
  shortDescription: string | null;
  category: string | null;
  vizeo: boolean | null;
  virtualQty: boolean | null;
  bom: boolean | null;
  publicPrice: number | null;
  purchasePriceEUR: number | null;
  currentStock: number | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductVersionStockResponseDto;
