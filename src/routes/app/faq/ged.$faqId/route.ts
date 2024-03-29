import { createFileRoute } from '@tanstack/react-router';
import { gedQueryKeys } from '../../../../utils/constants/queryKeys/ged';
import FileType from '../../../../utils/enums/FileType';
import { getDirectoryByTypeAndIdOnS3 } from '../../../../utils/api/ged';

export const Route = createFileRoute('/app/faq/ged/$faqId')({
  loader: ({ context: { queryClient }, params: { faqId } }) => {
    queryClient.ensureQueryData({
      queryKey: gedQueryKeys.detailByTypeAndId(FileType.FAQ, faqId),
      queryFn: () => getDirectoryByTypeAndIdOnS3(FileType.FAQ, faqId),
    });
  },
});
