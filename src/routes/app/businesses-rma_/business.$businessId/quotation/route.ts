import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  hideTotal: z.boolean().catch(false),
  hideReferences: z.boolean().catch(false),
  hidePrices: z.boolean().catch(false),
  hideAddresses: z.boolean().catch(false),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/quotation')({
  validateSearch: (data: { hideTotal?: boolean; hideReferences?: boolean; hidePrices?: boolean; hideAddresses?: boolean } & SearchSchemaInput) =>
    searchSchema.parse(data),
});
