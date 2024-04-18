import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import ProductShelfChangeRequestDto from '../types/ProductShelfChangeRequestDto';
import ProductShelfRequestDto from '../types/ProductShelfRequestDto';
import ProductShelfResponseDto from '../types/ProductShelfResponseDto';
import ShelfInventoryRequestDto from '../types/ShelfInventoryRequestDto';

export const getAllProductShelves = () => {
  return privateInstance<Array<ProductShelfResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/shelf/find-all`,
  }).then((res) => res.data);
};

export const getProductShelvesPage = ({ page, size }: { page: number; size: number }) => {
  return privateInstance<Page<ProductShelfResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/shelf/find-all-paged/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
  }).then((res) => res.data);
};

export const createProductShelf = (data: ProductShelfRequestDto) => {
  return privateInstance<ProductShelfResponseDto>({
    method: 'POST',
    url: `/product-inventory/v1/shelf/store`,
    data,
  }).then((res) => res.data);
};

export const deleteProductShelf = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/product-inventory/v1/shelf/delete/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const getProductShelfById = (id: string) => {
  return privateInstance<ProductShelfResponseDto>({
    method: 'GET',
    url: `/product-inventory/v1/shelf/find-by-id/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateShelf = (data: ProductShelfChangeRequestDto) => {
  return privateInstance<ProductShelfResponseDto>({
    method: 'POST',
    url: `/product-inventory/v1/shelf/update-shelf`,
    data,
  }).then((res) => res.data);
};

export const updateShelvesInventory = (data: ShelfInventoryRequestDto) => {
  return privateInstance<Array<ProductShelfResponseDto>>({
    method: 'PUT',
    url: '/product-inventory/v1/shelf/update-list-of-shelf-inventory',
    data,
  }).then((res) => res.data);
};
