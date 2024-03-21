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

export const getProductById = async (id: string) => {
  return (
    await privateInstance<ProductResponseDto>({
      method: 'GET',
      url: `/product/v1/find-by-id/${encodeURIComponent(id)}`,
    })
  ).data;
};
