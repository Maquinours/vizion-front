import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  hideReferencesPrices: z.boolean().catch(false),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/arc')({
  validateSearch: (data: { hideReferencesPrices?: boolean } & SearchSchemaInput) => searchSchema.parse(data),
});
