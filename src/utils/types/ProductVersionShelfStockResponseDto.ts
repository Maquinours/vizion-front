import ProductShelfResponseDto from './ProductShelfResponseDto';

type ProductVersionShelfStockProductShelfResponseDto = Omit<ProductShelfResponseDto, 'productShelfStockList' | 'productVersionShelfStockList'>;

type ProductVersionShelfStockResponseDto = {
  id: string;
  productVersionId: string | null;
  productId: string | null;
  productVersionShelf: ProductVersionShelfStockProductShelfResponseDto | null;
  currentStock: number | null;
  providerId: string | null;
  providerName: string | null;
  reference: string | null;
  versionReference: string | null;
  shortDescription: string | null;
  category: string | null;
  vizeo: boolean | null;
  virtualQty: boolean | null;
  bom: boolean | null;
  publicPrice: number | null;
  purchasePriceEUR: number | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductVersionShelfStockResponseDto;
