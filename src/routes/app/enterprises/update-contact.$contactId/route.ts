import { createFileRoute } from '@tanstack/react-router';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../utils/api/profile';

export const Route = createFileRoute('/app/enterprises/update-contact/$contactId')({
  loader: ({ context: { queryClient }, params: { contactId } }) => {
    queryClient.ensureQueryData({
      queryKey: profileQueryKeys.detailById(contactId),
      queryFn: () => getProfileById(contactId),
    });
  },
});
