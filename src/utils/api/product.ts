import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import ProductRequestDto from '../types/ProductRequestDto';
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

export const getProductsPage = (page: number, size: number) => {
  return privateInstance<Page<ProductResponseDto>>({
    method: 'GET',
    url: `/product/v1/list-page/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
  }).then((res) => res.data);
};

export const getProductsPageWithSearch = (ref: string | undefined, designation: string | undefined, page: number, size: number) => {
  return privateInstance<Page<ProductResponseDto>>({
    method: 'GET',
    url: `/product/v1/search-product/page`,
    params: {
      designation,
      ref,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const updateProduct = (id: string, data: ProductRequestDto) => {
  return privateInstance<ProductResponseDto>({
    method: 'PUT',
    url: `/product/v1/update/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteProduct = async (product: ProductResponseDto) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/product/v1/delete/${encodeURIComponent(product.id)}`,
  }).then((res) => res.data);
};

export const getAssociatedProductsPage = async (productId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<ProductResponseDto>>({
      method: 'GET',
      url: `/product/v1/list/associated/page`,
      params: {
        id: productId,
        page,
        size,
      },
    })
  ).data;
};

export const getNotAssociatedProducts = async (productId: string) => {
  return privateInstance<Array<ProductResponseDto>>({
    method: 'GET',
    url: `/product/v1/list/no-associated-and-category`,
    params: {
      id: productId,
      category: 'Accessoires',
    },
  }).then((res) => res.data);
};

export const addAssociatedProduct = async (productId: string, associatedProductId: string) => {
  return (
    await privateInstance<ProductResponseDto>({
      method: 'POST',
      url: `/product/v1/add-associated-product/${encodeURIComponent(productId)}/${encodeURIComponent(associatedProductId)}`,
    })
  ).data;
};

export const removeAssociatedProduct = async (productId: string, associatedProductId: string) => {
  return privateInstance<void>({
    method: 'POST',
    url: `/product/v1/dis-associated-product/${encodeURIComponent(productId)}/${encodeURIComponent(associatedProductId)}`,
  }).then((res) => res.data);
};
