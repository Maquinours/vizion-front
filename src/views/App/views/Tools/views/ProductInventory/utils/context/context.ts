import { createContext } from 'react';
import ProductVersionShelfStockResponseDto from '../../../../../../../../utils/types/ProductVersionShelfStockResponseDto';

type ProductInventoryContextType = {
  data: Array<{ stock: ProductVersionShelfStockResponseDto; comptedStock: number }>;
};

export const ProductInventoryContext = createContext<ProductInventoryContextType | null>(null);
