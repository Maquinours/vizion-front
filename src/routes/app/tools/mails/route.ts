import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  page: z.number().default(0),
});

export const Route = createFileRoute('/app/tools/mails')({
  validateSearch: (data: { search?: string; page?: number } & SearchSchemaInput) => searchSchema.parse(data),
});
