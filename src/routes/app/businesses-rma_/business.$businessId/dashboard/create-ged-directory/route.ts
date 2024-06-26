import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  relativePath: z.string(),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/create-ged-directory')({
  validateSearch: searchSchema,
});
