import CategoryClient from '../enums/CategoryClient';
import { privateInstance } from '../functions/axios';
import EnterpriseRequestDto from '../types/EnterpriseRequestDto';
import EnterpriseResponseDto from '../types/EnterpriseResponseDto';
import Page from '../types/Page';

export const getEnterpriseById = async (id: string) => {
  return (
    await privateInstance<EnterpriseResponseDto>({
      method: 'GET',
      url: `profile/v1/contact/find-by-id/${encodeURIComponent(id)}`,
    })
  ).data;
};

export const getEnterprises = async () => {
  return (
    await privateInstance<Array<EnterpriseResponseDto>>({
      method: 'GET',
      url: `profile/v1/contact/all`,
    })
  ).data;
};

type SearchPaginatedEnterprisesParams = {
  enterprise?: string;
  contact?: string;
  zipCode?: string;
  city?: string;
  phoneNumber?: string;
  representativeId?: string;
  category?: CategoryClient;
  page: number;
  size: number;
};
export const searchPaginatedEnterprises = async ({
  enterprise,
  contact,
  zipCode,
  city,
  phoneNumber,
  representativeId,
  category,
  page,
  size,
}: SearchPaginatedEnterprisesParams) => {
  return (
    await privateInstance<Page<EnterpriseResponseDto>>({
      method: 'GET',
      url: `profile/v1/contact/fuzzy-search-page/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
      params: {
        enterprise,
        contact,
        zipCode,
        city,
        phoneNumber,
        representativeId,
        category,
      },
    })
  ).data;
};

export const updateEnterprise = async (enterprise: EnterpriseResponseDto, data: EnterpriseRequestDto) => {
  return (
    await privateInstance<EnterpriseResponseDto>({
      method: 'PUT',
      url: `profile/v1/contact/update/${encodeURIComponent(enterprise.id)}`,
      data,
    })
  ).data;
};

export const getProviderEnterprises = async () => {
  return (
    await privateInstance<Array<EnterpriseResponseDto>>({
      method: 'GET',
      url: `profile/v1/contact/providers`,
    })
  ).data;
};

export const createEnterprise = (data: EnterpriseRequestDto) => {
  return privateInstance<EnterpriseResponseDto>({
    method: 'POST',
    url: 'profile/v1/contact//store-enterprise-profile',
    data,
  }).then((res) => res.data);
};
