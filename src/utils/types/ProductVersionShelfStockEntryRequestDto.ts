import StockOperationType from '../enums/StockOperationType';

type ProductVersionShelfStockEntryRequestDto = {
  currentStock?: number | null;
  stockEntry?: number | null;
  libEntry?: string | null;
  operationType?: StockOperationType | null;
  productVersionShelfStockId?: string | null;
  productVersionShelfStockCurrentStock?: number | null;
};

export default ProductVersionShelfStockEntryRequestDto;
