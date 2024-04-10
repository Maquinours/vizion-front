import { createQueryKeys } from '@lukemorales/query-key-factory';
import FileType from '../../enums/FileType';
import { getDirectoryByTypeAndIdOnS3 } from '../../api/ged';

export const geds = createQueryKeys('ged', {
  detail: {
    queryKey: null,
    contextQueries: {
      byTypeAndId: (type: FileType, id: string) => ({ queryKey: [type, id], queryFn: () => getDirectoryByTypeAndIdOnS3(type, id) }),
    },
  },
});
