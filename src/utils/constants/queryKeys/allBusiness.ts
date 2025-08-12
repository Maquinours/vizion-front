import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  getAllBusinessById,
  getAllBusinessPageByEnterpriseId,
  getAllBusinessPageByEnterpriseIdAndProfileId,
  getAllBusinesses,
  getAllBusinessesAssociated,
  getAllBusinessesNotAssociated,
  getAllBusinessesNotAssociatedByEnterpriseId,
  getByCategoryAndNumber,
  searchAllBusiness,
} from '../../api/allBusiness';
import AllBusinessState from '../../enums/AllBusinessState';
import CategoryBusiness from '../../enums/CategoryBusiness';
import CategoryClient from '../../enums/CategoryClient';
import AllBusinessQInfoRequestDto from '../../types/AllBusinessQInfoRequestDto';
import AllBusinessResponseDto from '../../types/AllBusinessResponseDto';

export const allBusinesses = createQueryKeys('all-businesses', {
  list: {
    queryKey: null,
    queryFn: getAllBusinesses,
    contextQueries: {
      notAssociated: ({ category, number }: { category: CategoryBusiness; number: string }) => ({
        queryKey: [category, number],
        queryFn: () => getAllBusinessesNotAssociated({ category, number }),
      }),
      associated: ({ category, number }: { category: CategoryBusiness; number: string }) => ({
        queryKey: [category, number],
        queryFn: () => getAllBusinessesAssociated({ category, number }),
      }),
      notAssociatedByEnterpriseId: (enterpriseId: string) => ({
        queryKey: [enterpriseId],
        queryFn: () => getAllBusinessesNotAssociatedByEnterpriseId(enterpriseId),
      }),
    },
  },
  page: {
    queryKey: null,
    contextQueries: {
      byEnterpriseIdAndPossibleProfileId: ({
        enterpriseId,
        profileId,
        page,
        size,
        sortBy,
        sortOrder,
      }: {
        enterpriseId: string;
        profileId?: string;
        page: number;
        size: number;
        sortBy?: keyof AllBusinessResponseDto;
        sortOrder?: 'ASC' | 'DESC';
      }) => ({
        queryKey: [{ enterpriseId, profileId, page, size, sortBy, sortOrder }],
        queryFn: () =>
          profileId
            ? getAllBusinessPageByEnterpriseIdAndProfileId(enterpriseId, profileId, page, size, sortBy, sortOrder)
            : getAllBusinessPageByEnterpriseId(enterpriseId, page, size, sortBy, sortOrder),
      }),
      search: (
        searchData: {
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
          sortBy?: keyof AllBusinessResponseDto;
          sortOrder?: 'ASC' | 'DESC';
        },
        pageData: { page: number; size: number },
      ) => ({
        queryKey: [searchData, pageData],
        queryFn: () => searchAllBusiness(searchData, pageData),
      }),
    },
  },
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getAllBusinessById(id),
      }),
      byCategoryAndNumber: ({ category, number }: { category: CategoryBusiness; number: string }) => ({
        queryKey: [category, number],
        queryFn: () => getByCategoryAndNumber({ category, number }),
      }),
    },
  },
});
