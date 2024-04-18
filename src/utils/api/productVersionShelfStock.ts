import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import ProductVersionShelfStockRequestDto from '../types/ProductVersionShelfStockRequestDto';
import ProductVersionShelfStockResponseDto from '../types/ProductVersionShelfStockResponseDto';

export const getProductVersionShelfStocksPageByProductId = async (productId: string, page: number, size: number) => {
  return privateInstance<Page<ProductVersionShelfStockResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/product-version-shelf-stock/find-all-by-product/${encodeURIComponent(productId)}/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
    params: {
      productId,
    },
  }).then((res) => res.data);
};

export const createProductVersionShelfStock = (data: ProductVersionShelfStockRequestDto) => {
  return privateInstance<ProductVersionShelfStockResponseDto>({
    method: 'POST',
    url: '/product-inventory/v1/product-version-shelf-stock/store',
    data,
  }).then((res) => res.data);
};

export const getProductVersionShelfStockById = (id: string) => {
  return privateInstance<ProductVersionShelfStockResponseDto>({
    method: 'GET',
    url: `/product-inventory/v1/product-version-shelf-stock/find-by-id/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateProductVersionShelfStockQuantity = (id: string, quantity: number) => {
  return privateInstance<ProductVersionShelfStockResponseDto>({
    method: 'GET',
    url: `/product-inventory/v1/product-version-shelf-stock/update-quantity/${encodeURIComponent(id)}`,
    data: {
      quantity,
    },
  }).then((res) => res.data);
};

export const deleteProductVersionShelfStock = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/product-inventory/v1/product-version-shelf-stock/delete/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const getProductVersionShelfStocksExcel = () => {
  return privateInstance<Blob>({
    method: 'GET',
    url: `/product-inventory/v1/product-version-shelf-stock/download`,
    responseType: 'blob',
  }).then((res) => res.data);
};

export const getProductVersionShelfStocksPage = ({ page, size }: { page: number; size: number }) => {
  return privateInstance<Page<ProductVersionShelfStockResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/product-version-shelf-stock/find-all-paged/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
  }).then((res) => res.data);
};
