import { createQueryKeys } from '@lukemorales/query-key-factory';
import { base64ToBlob, fileToBase64, imageUriToBase64, pdfUriToBase64Image } from '../../functions/files';

export const filesQueryKeys = createQueryKeys('files', {
  base64: {
    queryKey: null,
    contextQueries: {
      pdfUriToImage: (uri: string) => ({
        queryKey: [uri],
        queryFn: () => pdfUriToBase64Image(uri),
      }),
      fromFile: (file: File) => ({
        queryKey: [{ name: file.name, size: file.size, type: file.size }],
        queryFn: () => fileToBase64(file),
      }),
      fromUri: (uri: string) => ({
        queryKey: [uri],
        queryFn: () => imageUriToBase64(uri),
      }),
    },
  },
  blob: {
    queryKey: null,
    contextQueries: {
      fromBase64: (base64: string) => ({
        queryKey: [base64],
        queryFn: () => base64ToBlob(base64),
      }),
      fromUri: (uri: string) => ({
        queryKey: [uri],
        queryFn: () => fetch(uri).then((res) => res.blob()),
      }),
    },
  },
});
