import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const SearchSchema = z.object({
  sendEmailModal: z.enum(['predefined-messages']).optional().catch(undefined),
});

export const Route = createFileRoute('/app/dashboard/task-email/$taskId/reply')({
  validateSearch: SearchSchema,
});
