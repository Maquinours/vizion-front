import { createFileRoute } from '@tanstack/react-router';
import { geds } from '../../../../utils/constants/queryKeys/ged';
import FileType from '../../../../utils/enums/FileType';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/faq/ged/$faqId')({
  loader: ({ context: { queryClient }, params: { faqId } }) => {
    queryClient.prefetchQuery(geds.detail._ctx.byTypeAndId(FileType.FAQ, faqId));
  },
  pendingComponent: LoaderModal,
});
