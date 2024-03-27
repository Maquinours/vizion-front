import StockOperationType from '../enums/StockOperationType';

type ProductVersionShelfStockEntryResponseDto = {
  id: string;
  currentStock: number | null;
  stockBefore: number | null;
  stockEntry: number | null;
  libEntry: string | null;
  operationType: StockOperationType | null;
  numBusiness: string | null;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductVersionShelfStockEntryResponseDto;
