import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getDdnsById, getDdnsExistsBySubDomain, getDdnsPage, getDdnsPageWithSearch } from '../../api/ddns';

export const ddns = createQueryKeys('ddns', {
  exists: (subDomain: string) => ({ queryKey: [{ subDomain }], queryFn: () => getDdnsExistsBySubDomain(subDomain) }),
  page: ({
    email,
    domain,
    serial,
    ref,
    date,
    page,
    size,
  }: {
    email: string | undefined;
    domain: string | undefined;
    serial: string | undefined;
    ref: string | undefined;
    date: Date | undefined;
    page: number;
    size: number;
  }) => ({
    queryKey: [{ email, domain, serial, ref, date, page, size }],
    queryFn: () => (email || domain || serial || ref || date ? getDdnsPageWithSearch(email, domain, serial, ref, date, page, size) : getDdnsPage(page, size)),
  }),
  detail: (id: string) => ({ queryKey: [{ id }], queryFn: () => getDdnsById(id) }),
});
