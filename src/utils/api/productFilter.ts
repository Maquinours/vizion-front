import { privateInstance } from '../functions/axios';
import AdvancedProductSpecificationResponseDto from '../types/AdvancedProductSpecificationResponseDto';

export const getAllProductFilters = async () => {
  return (
    await privateInstance<Array<AdvancedProductSpecificationResponseDto>>({
      method: 'GET',
      url: `/product/v1/specs/list`,
    })
  ).data;
};

export const getProductFilterById = (id: string) => {
  return privateInstance<AdvancedProductSpecificationResponseDto>({
    method: 'GET',
    url: `/product/v1/specs/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
