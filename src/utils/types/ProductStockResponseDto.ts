type ProductStockResponseDto = {
  id: string;
  productId: string | null;
  prodivderId: string | null;
  providerName: string | null;
  reference: string | null;
  shortDescription: string | null;
  category: string | null;
  vizeo: boolean | null;
  publicPrice: number | null;
  purchasePriceEUR: number | null;
  currentStock: number | null;
  virtualQty: boolean | null;
  bom: boolean | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductStockResponseDto;
