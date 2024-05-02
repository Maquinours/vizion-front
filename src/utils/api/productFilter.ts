import { privateInstance } from '../functions/axios';
import AdvancedProductSpecificationRequestDto from '../types/AdvancedProductSpecificationRequestDto';
import AdvancedProductSpecificationResponseDto from '../types/AdvancedProductSpecificationResponseDto';
import Page from '../types/Page';

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

export const getProductFiltersPage = ({ page, size }: { page: number; size: number }) => {
  return privateInstance<Page<AdvancedProductSpecificationResponseDto>>({
    method: 'GET',
    url: `/product/v1/specs/list-page/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
  }).then((res) => res.data);
};

export const createProductFilter = (data: AdvancedProductSpecificationRequestDto) => {
  return privateInstance<AdvancedProductSpecificationResponseDto>({
    method: 'POST',
    url: `/product/v1/specs/add`,
    data,
  }).then((res) => res.data);
};

export const updateProductFilter = (id: string, data: AdvancedProductSpecificationRequestDto) => {
  return privateInstance<AdvancedProductSpecificationResponseDto>({
    method: 'PUT',
    url: `/product/v1/specs/update/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteProductFilter = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/product/v1/specs/delete/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
