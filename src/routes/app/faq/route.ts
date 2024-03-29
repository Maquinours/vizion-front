import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  page: z.number().catch(0),
  archived: z.boolean().catch(false),
});

export const Route = createFileRoute('/app/faq')({
  validateSearch: searchSchema,
});
