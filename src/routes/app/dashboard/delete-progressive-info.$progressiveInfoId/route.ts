import { createFileRoute } from '@tanstack/react-router';
import { progressiveInfoQueryKeys } from '../../../../utils/constants/queryKeys/progressiveInfo';
import { getProgressiveInfoById } from '../../../../utils/api/progressiveInfo';

export const Route = createFileRoute('/app/dashboard/delete-progressive-info/$progressiveInfoId')({
  loader: ({ context: { queryClient }, params: { progressiveInfoId } }) =>
    queryClient.ensureQueryData({
      queryKey: progressiveInfoQueryKeys.detailById(progressiveInfoId),
      queryFn: () => getProgressiveInfoById(progressiveInfoId),
    }),
});
