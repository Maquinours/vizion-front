import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  searchText: z.string().optional(),
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/address-book')({
  validateSearch: (data: { searchText?: string; page?: number } & SearchSchemaInput) => searchSchema.parse(data),
});
