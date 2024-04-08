import { createQueryKeys } from '@lukemorales/query-key-factory';
import CategoryClient from '../../enums/CategoryClient';
import { getEnterpriseById, getEnterprises, getProviderEnterprises, searchPaginatedEnterprises } from '../../api/enterprise';
import { getEnterprisesByCategory } from '../../api/enterprises';

export const enterprises = createQueryKeys('enterprise', {
  list: {
    queryKey: null,
    queryFn: getEnterprises,
    contextQueries: {
      byCategory: (category: CategoryClient) => ({ queryKey: [{ category }], queryFn: () => getEnterprisesByCategory(category) }),
      providers: { queryKey: [{ provider: true }], queryFn: getProviderEnterprises },
    },
  },
  detail: (id: string) => ({ queryKey: [{ id }], queryFn: () => getEnterpriseById(id) }),
  page: ({
    enterprise,
    contact,
    zipCode,
    city,
    phoneNumber,
    category,
    representativeId,
    page,
    size,
  }: {
    enterprise?: string;
    contact?: string;
    zipCode?: string;
    city?: string;
    phoneNumber?: string;
    representativeId?: string;
    category?: CategoryClient;
    page: number;
    size: number;
  }) => ({
    queryKey: [{ enterprise, contact, zipCode, city, phoneNumber, category, representativeId, page, size }],
    queryFn: () => searchPaginatedEnterprises({ enterprise, contact, zipCode, city, phoneNumber, category, representativeId, page, size }),
  }),
});
