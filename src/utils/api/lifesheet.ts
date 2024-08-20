import { privateInstance } from '../functions/axios';
import LifeSheetRequestDto from '../types/LifeSheetRequestDto';
import LifeSheetResponseDto from '../types/LifeSheetResponseDto';
import Page from '../types/Page';

export const getLifesheetPageByProductId = async (productId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<LifeSheetResponseDto>>({
      method: 'GET',
      url: `/life-sheet/v1/hist/all-by-product-paged`,
      params: {
        productId,
        page,
        size,
      },
    })
  ).data;
};

export const getLifesheetPageByEnterpriseId = async (enterpriseId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<LifeSheetResponseDto>>({
      method: 'GET',
      url: `/life-sheet/v1/hist/all-by-enterprise-paged`,
      params: {
        enterpriseId,
        page,
        size,
      },
    })
  ).data;
};

export const getLifesheetPageByRmaId = async (rmaId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<LifeSheetResponseDto>>({
      method: 'GET',
      url: `/life-sheet/v1/hist/all-by-rma-paged`,
      params: {
        rmaId,
        page,
        size,
      },
    })
  ).data;
};

export const getLifesheetPageByAssistanceId = async (assistanceId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<LifeSheetResponseDto>>({
      method: 'GET',
      url: `/life-sheet/v1/hist/all-by-technical-assistance-paged`,
      params: {
        assistanceId,
        page,
        size,
      },
    })
  ).data;
};

export const getLifesheetPageByBusinessId = async (businessId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<LifeSheetResponseDto>>({
      method: 'GET',
      url: `/life-sheet/v1/hist/all-by-business-paged`,
      params: {
        businessId,
        page,
        size,
      },
    })
  ).data;
};

export const createLifesheet = async (data: LifeSheetRequestDto) => {
  return (
    await privateInstance<LifeSheetResponseDto>({
      method: 'POST',
      url: '/life-sheet/v1/hist/store',
      data,
    })
  ).data;
};

export const getLifesheetById = async (id: string) => {
  return (
    await privateInstance<LifeSheetResponseDto>({
      method: 'GET',
      url: `/life-sheet/v1/hist/find-by-id/${encodeURIComponent(id)}`,
    })
  ).data;
};
