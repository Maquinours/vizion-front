import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getPredefinedTextById, getPredefinedTexts, getPredefinedTextsPage } from '../../api/predefinedText';

export const predefinedTexts = createQueryKeys('predefined-text', {
  list: {
    queryKey: null,
    queryFn: getPredefinedTexts,
  },
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    queryFn: () => getPredefinedTextsPage({ page, size }),
  }),
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getPredefinedTextById(id),
  }),
});
