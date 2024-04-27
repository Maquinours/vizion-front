import CategoryBusiness from '../enums/CategoryBusiness';
import { privateInstance } from '../functions/axios';
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
