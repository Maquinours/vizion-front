import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
  shelfId: z.string().uuid().optional().catch(undefined),
  versionId: z.string().uuid().optional().catch(undefined),
});

export const Route = createFileRoute('/app/tools/product-inventory')({
  validateSearch: searchSchema,
});
