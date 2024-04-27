import ProductVersionShelfStockRequestDto from './ProductVersionShelfStockRequestDto';

type ProductShelfRequestDto = {
  number?: string | null;
  updateNumber?: string | null;
  note?: string | null;
  productVersionShelfStockDto?: ProductVersionShelfStockRequestDto | null;
};

export default ProductShelfRequestDto;
