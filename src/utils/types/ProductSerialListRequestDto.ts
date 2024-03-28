import ProductSerialNumberRequestDto from './ProductSerialNumberRequestDto';

type ProductSerialListRequestDto = {
  productId?: string | null;
  productRef?: string | null;
  productVersionRef?: string | null;
  serialNumberDtoList?: ProductSerialNumberRequestDto[] | null;
  productShelfNum?: string | null;
  productShelfId?: string | null;
};

export default ProductSerialListRequestDto;
