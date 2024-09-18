import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import ProductSerialNumberResponseDto from '../types/ProductSerialNumberResponseDto';
import ProductSerialListRequestDto from '../types/ProductSerialListRequestDto';
import SerialNumberResponseDto from '../types/SerialNumberResponseDto';
import UpdateProductSerialNumberRequestDto from '../types/UpdateProductSerialNumberRequestDto';

export const getProductSerialNumbersPage = async (page: number, size: number) => {
  return privateInstance<Page<ProductSerialNumberResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/serial/find-all/page`,
    params: {
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getProductSerialNumbersPageWithSearch = async (searchText: string, page: number, size: number) => {
  return privateInstance<Page<ProductSerialNumberResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/serial/search`,
    params: {
      searchText,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getProductSerialNumberById = async (id: string) => {
  return privateInstance<ProductSerialNumberResponseDto>({
    method: 'GET',
    url: `/product-inventory/v1/serial/find-by-id`,
    params: {
      id,
    },
  }).then((res) => res.data);
};

export const deleteProductSerialNumber = async (id: string) => {
  return privateInstance<ProductSerialNumberResponseDto>({
    method: 'DELETE',
    url: `/product-inventory/v1/serial/delete`,
    params: {
      id,
    },
  }).then((res) => res.data);
};

export const createProductSerialNumbers = (data: ProductSerialListRequestDto) => {
  return privateInstance<Array<ProductSerialNumberResponseDto>>({
    method: 'POST',
    url: `/product-inventory/v1/serial/store`,
    data,
  }).then((res) => res.data);
};

export const getSerialNumberDataByNumberAndCategory = (number: string, category: string) => {
  return privateInstance<SerialNumberResponseDto>({
    method: 'GET',
    url: `/product-inventory/v1/serial/find/serial-number-and-category-vizeo`,
    params: {
      number,
      category,
    },
  }).then((res) => res.data);
};

export const getProductSerialNumberByNumber = async (number: string) => {
  return privateInstance<ProductSerialNumberResponseDto>({
    method: 'GET',
    url: `/product-inventory/v1/serial/find/serial-number`,
    params: {
      number,
    },
  }).then((res) => res.data);
};

export const updateProductSerialNumberNote = (id: string, data: UpdateProductSerialNumberRequestDto) => {
  return privateInstance<ProductSerialNumberResponseDto>({
    method: 'PUT',
    url: `/product-inventory/v1/serial/note/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};
