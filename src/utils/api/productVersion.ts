import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import ProductVersionRequestDto from '../types/ProductVersionRequestDto';
import ProductVersionResponseDto from '../types/ProductVersionResponseDto';

export const getProductVersionsPageByProductId = async (productId: string, page: number, size: number) => {
  return privateInstance<Page<ProductVersionResponseDto>>({
    method: 'GET',
    url: `/product/v1/version/list/product/page`,
    params: {
      productId,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const createProductVersion = (data: ProductVersionRequestDto) => {
  return privateInstance<ProductVersionResponseDto>({
    method: 'POST',
    url: '/product/v1/version/add',
    data,
  }).then((res) => res.data);
};

export const getProductVersionById = (id: string) => {
  return privateInstance<ProductVersionResponseDto>({
    method: 'GET',
    url: `/product/v1/version/find-by-id/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateProductVersion = (id: string, data: ProductVersionRequestDto) => {
  return privateInstance<ProductVersionResponseDto>({
    method: 'PUT',
    url: `/product/v1/version/update/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteProductVersion = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/product/v1/version/delete/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const getProductVersionsByProductId = (productId: string) => {
  return privateInstance<Array<ProductVersionResponseDto>>({
    method: 'GET',
    url: `/product/v1/version/list/product`,
    params: {
      productId,
    },
  }).then((res) => res.data);
};

export const getProductVersions = () => {
  return privateInstance<Array<ProductVersionResponseDto>>({
    method: 'GET',
    url: `/product/v1/version/list`,
  }).then((res) => res.data);
};
