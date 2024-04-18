import ProductVersionShelfStockRequestDto from './ProductVersionShelfStockRequestDto';

type ProductShelfUpdateRequestDto = {
  number?: string | null;
  updateNumber?: string | null;
  note?: string | null;
  versionShelfStockDtoList?: Array<ProductVersionShelfStockRequestDto> | null;
};

export default ProductShelfUpdateRequestDto;
