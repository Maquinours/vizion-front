import ProductVersionShelfStockEntryRequestDto from './ProductVersionShelfStockEntryRequestDto';

type ProductVersionShelfStockRequestDto = {
  productVersionId?: string | null;
  productId?: string | null;
  productVersionShelfId?: string | null;
  providerId?: string | null;
  providerName?: string | null;
  reference?: string | null;
  versionReference?: string | null;
  shortDescription?: string | null;
  category?: string | null;
  publicPrice?: number | null;
  currentStock?: number | null;
  vizeo?: boolean | null;
  purchasePriceEUR?: number | null;
  productVersionShelfStockEntryDto?: ProductVersionShelfStockEntryRequestDto | null;
  virtualQty?: boolean | null;
  bom?: boolean | null;
};

export default ProductVersionShelfStockRequestDto;
