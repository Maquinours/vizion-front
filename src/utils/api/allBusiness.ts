import AllBusinessState from '../enums/AllBusinessState';
import CategoryBusiness from '../enums/CategoryBusiness';
import CategoryClient from '../enums/CategoryClient';
import { privateInstance } from '../functions/axios';
import AllBusinessQInfoRequestDto from '../types/AllBusinessQInfoRequestDto';
import AllBusinessResponseDto from '../types/AllBusinessResponseDto';
import Page from '../types/Page';

export const getAllBusinesses = async () => {
  return (
    await privateInstance<Array<AllBusinessResponseDto>>({
      method: 'GET',
      url: `/all-business/v1/all-business-and-rma/`,
    })
  ).data;
};

export const getAllBusinessPageByEnterpriseId = async (enterpriseId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<AllBusinessResponseDto>>({
      method: 'GET',
      url: `/all-business/v1/all-business-and-rma/find/enterprise/page`,
      params: {
        enterpriseId,
        page,
        size,
      },
    })
  ).data;
};

export const getAllBusinessesNotAssociated = ({ category, number }: { category: CategoryBusiness; number: string }) => {
  return privateInstance<Array<AllBusinessResponseDto>>({
    method: 'GET',
    url: `/all-business/v1/all-business-and-rma/find-all-not-associated-by-number-and-category`,
    params: {
      category,
      number,
    },
  }).then((res) => res.data);
};

export const associateAllBusiness = (first: { category: CategoryBusiness; number: string }, second: { category: CategoryBusiness; number: string }) => {
  return privateInstance<boolean>({
    method: 'PUT',
    url: `/all-business/v1/all-business-and-rma/associate-by-number`,
    params: {
      category1: first.category,
      number1: first.number,
      category2: second.category,
      number2: second.number,
    },
  }).then((res) => res.data);
};

export const getAllBusinessesAssociated = ({ category, number }: { category: CategoryBusiness; number: string }) => {
  return privateInstance<Array<AllBusinessResponseDto>>({
    method: 'GET',
    url: `/all-business/v1/all-business-and-rma/find-all-associated-by-number-and-category`,
    params: {
      category,
      number,
    },
  }).then((res) => res.data);
};

export const getAllBusinessById = (id: string) => {
  return privateInstance<AllBusinessResponseDto>({
    method: 'GET',
    url: `/all-business/v1/all-business-and-rma/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const disassociateAllBusiness = (first: { category: CategoryBusiness; number: string }, second: { category: CategoryBusiness; number: string }) => {
  return privateInstance<boolean>({
    method: 'DELETE',
    url: `/all-business/v1/all-business-and-rma/disassociate-by-number`,
    params: {
      category1: first.category,
      number1: first.number,
      category2: second.category,
      number2: second.number,
    },
  }).then((res) => res.data);
};

export const searchAllBusiness = (
  {
    startDate,
    endDate,
    numBusiness,
    minAmount,
    maxAmount,
    numOrder,
    zipCode,
    title,
    contact,
    deliverPhoneNumber,
    enterpriseName,
    representativeId,
    installerName,
    state,
    excludedList,
    qInfos,
    fuzzy,
  }: {
    startDate?: Date | null;
    endDate?: Date | null;
    numBusiness?: string | null;
    minAmount?: number | null;
    maxAmount?: number | null;
    numOrder?: string | null;
    zipCode?: string | null;
    title?: string | null;
    contact?: string | null;
    deliverPhoneNumber?: string | null;
    enterpriseName?: string | null;
    representativeId?: string | null;
    installerName?: string | null;
    state?: AllBusinessState | null;
    excludedList?: Array<CategoryClient> | null;
    qInfos?: Array<AllBusinessQInfoRequestDto> | null;
    fuzzy: boolean;
  },
  { page, size }: { page: number; size: number },
) => {
  return privateInstance<Page<AllBusinessResponseDto>>({
    method: 'POST',
    url: `/all-business/v1/all-business-and-rma/search/page/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
    params: {
      startDate,
      endDate,
      numBusiness,
      minAmount,
      maxAmount,
      numOrder,
      zipCode,
      title,
      contact,
      deliverPhoneNumber,
      enterpriseName,
      representativeId,
      installerName,
      state,
      excludedList,
      fuzzy,
    },
    data: qInfos,
  }).then((res) => res.data);
};

export const indexAllBusinesses = () => {
  return privateInstance<void>({
    method: 'POST',
    url: `/all-business/v1/all-business-and-rma/index-all`,
  }).then((res) => res.data);
};

export const getAllBusinessesNotAssociatedByEnterpriseId = (enterpriseId: string) => {
  return privateInstance<Array<AllBusinessResponseDto>>({
    method: 'GET',
    url: `/all-business/v1/all-business-and-rma/all-not-associated-by-enterprise/${encodeURIComponent(enterpriseId)}`,
  }).then((res) => res.data);
};

export const relateAllBusinessToEnterprise = (allBusinessId: string, enterpriseId: string) => {
  return privateInstance<void>({
    method: 'POST',
    url: `/all-business/v1/all-business-and-rma/relate-enterprise/${encodeURIComponent(allBusinessId)}/${encodeURIComponent(enterpriseId)}`,
  }).then((res) => res.data);
};

export const unrelateAllBusinessToEnterprise = (allBusinessId: string, enterpriseId: string) => {
  return privateInstance<void>({
    method: 'POST',
    url: `/all-business/v1/all-business-and-rma/unrelate-enterprise/${encodeURIComponent(allBusinessId)}/${encodeURIComponent(enterpriseId)}`,
  }).then((res) => res.data);
};

export const getAllBusinessPageByEnterpriseIdAndProfileId = async (enterpriseId: string, profileId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<AllBusinessResponseDto>>({
      method: 'GET',
      url: `/all-business/v1/all-business-and-rma/find/enterprise-profile/page`,
      params: {
        enterpriseId,
        profileId,
        page,
        size,
      },
    })
  ).data;
};

export const updateAllBusinessModifyDate = (category: CategoryBusiness, numBusiness: string, userId: string) => {
  return privateInstance<void>({
    method: 'POST',
    url: `/all-business/v1/all-business-and-rma/update-lazy`,
    params: {
      category,
      numBusiness,
      userId,
    },
  });
};
