import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  dates: z.array(z.coerce.date()).length(2).optional().catch(undefined),
  isAllDay: z.boolean().optional().catch(undefined),
  oldParticipant: z.string().uuid().optional().catch(undefined),
  newParticipant: z.string().uuid().optional().catch(undefined),
});

export const Route = createFileRoute('/app/tools/scheduler/details/$rdvId/update')({
  validateSearch: searchSchema,
});
