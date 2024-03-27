import { privateInstance } from '../functions/axios';
import AdvancedProductSpecificationProductResponseDto from '../types/AdvancedProductSpecificationProductResponseDto';
import Page from '../types/Page';

export const getProductSpecificationsPageByProductId = (productId: string, page: number, size: number) => {
  return privateInstance<Page<AdvancedProductSpecificationProductResponseDto>>({
    method: 'GET',
    url: `/product/v1/list/specs/page`,
    params: {
      productId,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getProductSpecificationById = (productId: string, specificationId: string) => {
  return privateInstance<AdvancedProductSpecificationProductResponseDto>({
    method: 'GET',
    url: `/product/v1/product-specification/${encodeURIComponent(productId)}/${encodeURIComponent(specificationId)}`,
  }).then((res) => res.data);
};

export const addProductSpecificationToProduct = async (
  productId: string,
  specificationId: string,
  value: number | null,
  minValue: number | null,
  maxValue: number | null,
) => {
  return privateInstance<AdvancedProductSpecificationProductResponseDto>({
    method: 'POST',
    url: `/product/v1/add-advanced-specs/${encodeURIComponent(productId)}/${encodeURIComponent(specificationId)}`,
    params: {
      value,
      minValue,
      maxValue,
    },
  }).then((res) => res.data);
};

export const updateProductSpecification = async (
  productId: string,
  specificationId: string,
  value: number | null,
  minValue: number | null,
  maxValue: number | null,
) => {
  return privateInstance<AdvancedProductSpecificationProductResponseDto>({
    method: 'PUT',
    url: `/product/v1/product-specification/${encodeURIComponent(productId)}/${encodeURIComponent(specificationId)}`,
    params: {
      value,
      minValue,
      maxValue,
    },
  }).then((res) => res.data);
};

export const deleteProductSpecification = async (productId: string, specificationId: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/product/v1/product-specification/${encodeURIComponent(productId)}/${encodeURIComponent(specificationId)}`,
  }).then((res) => res.data);
};
