import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/bl')({
  validateSearch: (data: { page?: number } & SearchSchemaInput) => searchSchema.parse(data),
});
