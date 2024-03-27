import { privateInstance } from '../functions/axios';
import ProductShelfResponseDto from '../types/ProductShelfResponseDto';

export const getAllProductShelves = () => {
  return privateInstance<Array<ProductShelfResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/shelf/find-all`,
  }).then((res) => res.data);
};
