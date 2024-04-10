import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getPredefinedTexts } from '../../api/predefinedText';

export const predefinedTexts = createQueryKeys('predefined-text', {
  list: {
    queryKey: null,
    queryFn: getPredefinedTexts,
  },
});
