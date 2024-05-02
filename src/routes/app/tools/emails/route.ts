import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  spam: z.boolean().optional().catch(undefined),
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/tools/emails')({
  validateSearch: searchSchema,
  staticData: {
    title: 'Emails',
  },
});
