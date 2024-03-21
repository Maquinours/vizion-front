import { privateInstance } from '../functions/axios';
import AddressRequestDto from '../types/AddressRequestDto';
import AddressResponseDto from '../types/AddressResponseDto';
import Page from '../types/Page';

export const searchPaginatedAddressesByEnterpriseId = async (enterpriseId: string, search: string, page: number, size: number) => {
  return (
    await privateInstance<Page<AddressResponseDto>>({
      method: 'GET',
      url: `/business/v1/address/search/enterprise-paged`,
      params: {
        enterpriseId,
        search,
        page,
        size,
      },
    })
  ).data;
};

export const createAddress = async (address: AddressRequestDto) => {
  return (
    await privateInstance<AddressResponseDto>({
      method: 'POST',
      url: '/business/v1/address/add',
      data: address,
    })
  ).data;
};

export const getAddressById = async (id: string) => {
  return (
    await privateInstance<AddressResponseDto>({
      method: 'GET',
      url: `/business/v1/address/${encodeURIComponent(id)}`,
    })
  ).data;
};

export const deleteAddress = async (address: AddressResponseDto) => {
  return (
    await privateInstance<void>({
      method: 'DELETE',
      url: `/business/v1/address/${encodeURIComponent(address.id)}`,
    })
  ).data;
};

export const updateAddress = async (oldAddress: AddressResponseDto, newAddress: AddressRequestDto) => {
  return (
    await privateInstance<AddressResponseDto>({
      method: 'PUT',
      url: `/business/v1/address/${encodeURIComponent(oldAddress.id)}`,
      data: newAddress,
    })
  ).data;
};
