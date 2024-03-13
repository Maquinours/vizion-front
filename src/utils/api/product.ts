import { privateInstance } from '../functions/axios';
import ProductResponseDto from '../types/ProductResponseDto';

export const getProducts = async () => {
  return (
    await privateInstance<Array<ProductResponseDto>>({
      method: 'GET',
      url: `/product/v1/list`,
    })
  ).data;
};
