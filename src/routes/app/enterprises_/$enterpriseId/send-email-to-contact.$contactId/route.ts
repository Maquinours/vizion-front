import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { profileQueryKeys } from '../../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../../utils/api/profile';

const searchSchema = z.object({
  sendEmailModal: z.enum(['predefined-messages']).optional().catch(undefined),
});

export const Route = createFileRoute('/app/enterprises/$enterpriseId/send-email-to-contact/$contactId')({
  validateSearch: searchSchema,
  loader: ({ context: { queryClient }, params: { contactId } }) =>
    queryClient.ensureQueryData({ queryKey: profileQueryKeys.detailById(contactId), queryFn: () => getProfileById(contactId) }),
});
