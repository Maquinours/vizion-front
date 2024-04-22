import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  getAllBusinessById,
  getAllBusinessPageByEnterpriseId,
  getAllBusinesses,
  getAllBusinessesAssociated,
  getAllBusinessesNotAssociated,
} from '../../api/allBusiness';
import CategoryBusiness from '../../enums/CategoryBusiness';

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
    },
  },
  page: ({ enterpriseId, page, size }: { enterpriseId: string; page: number; size: number }) => ({
    queryKey: [{ enterpriseId, page, size }],
    queryFn: () => getAllBusinessPageByEnterpriseId(enterpriseId, page, size),
  }),
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
