import { createQueryKeys } from '@lukemorales/query-key-factory';
import { pdfUriToBase64Image } from '../../functions/files';

export const filesQueryKeys = createQueryKeys('files', {
  base64: {
    queryKey: null,
    contextQueries: {
      pdfUriToImage: (uri: string) => ({
        queryKey: [uri],
        queryFn: () => pdfUriToBase64Image(uri),
      }),
    },
  },
});
