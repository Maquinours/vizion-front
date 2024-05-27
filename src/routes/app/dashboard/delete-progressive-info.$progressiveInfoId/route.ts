import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import ProgressiveInfoResponseDto from '../../../../utils/types/ProgressiveInfoResponseDto';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/dashboard/delete-progressive-info/$progressiveInfoId')({
  loader: ({ context: { queryClient }, params: { progressiveInfoId } }) =>
    queryClient.ensureQueryData({
      ...queries['progressive-infos'].detail(progressiveInfoId),
      initialData: () =>
        queryClient.getQueryData<Array<ProgressiveInfoResponseDto>>(queries['progressive-infos'].list.queryKey)?.find((item) => item.id === progressiveInfoId),
      initialDataUpdatedAt: () => queryClient.getQueryState(queries['progressive-infos'].list.queryKey)?.dataUpdatedAt,
    }),
  pendingComponent: LoaderModal,
});
