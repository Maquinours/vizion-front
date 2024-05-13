import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  dates: z.array(z.coerce.date()).length(2).optional().catch(undefined),
  participant: z.string().uuid().optional().catch(undefined),
});

export const Route = createFileRoute('/app/tools/scheduler/create')({
  validateSearch: searchSchema,
});
