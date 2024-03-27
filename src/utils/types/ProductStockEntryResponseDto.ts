import StockOperationType from '../enums/StockOperationType';

type ProductStockEntryResponseDto = {
  id: string;
  currentStock: number | null;
  stockBefore: number | null;
  stockEntry: number | null;
  libEntry: string | null;
  authorFullName: string | null;
  operationType: StockOperationType | null;
  numBusiness: string | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductStockEntryResponseDto;
