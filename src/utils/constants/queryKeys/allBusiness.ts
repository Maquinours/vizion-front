import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  getAllBusinessById,
  getAllBusinessPageByEnterpriseId,
  getAllBusinessPageByEnterpriseIdAndProfileId,
  getAllBusinesses,
  getAllBusinessesAssociated,
  getAllBusinessesNotAssociated,
  getAllBusinessesNotAssociatedByEnterpriseId,
  searchAllBusiness,
} from '../../api/allBusiness';
import CategoryBusiness from '../../enums/CategoryBusiness';
import AllBusinessState from '../../enums/AllBusinessState';
import CategoryClient from '../../enums/CategoryClient';
import AllBusinessQInfoRequestDto from '../../types/AllBusinessQInfoRequestDto';

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
      }: {
        enterpriseId: string;
        profileId?: string;
        page: number;
        size: number;
      }) => ({
        queryKey: [{ enterpriseId, profileId, page, size }],
        queryFn: () =>
          profileId
            ? getAllBusinessPageByEnterpriseIdAndProfileId(enterpriseId, profileId, page, size)
            : getAllBusinessPageByEnterpriseId(enterpriseId, page, size),
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
    },
  },
});
