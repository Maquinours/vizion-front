import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getExternalLinkById, getExternalLinksPageByArchiveState } from '../../api/externalLink';

export const externalLinks = createQueryKeys('external-link', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [{ page, size }],
    contextQueries: {
      byArchiveState: (archived: boolean) => ({ queryKey: [archived], queryFn: () => getExternalLinksPageByArchiveState(archived, page, size) }),
    },
  }),
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({ queryKey: [id], queryFn: () => getExternalLinkById(id) }),
    },
  },
});
