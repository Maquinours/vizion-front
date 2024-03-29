import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  relativePath: z.string().optional(),
});

export const Route = createFileRoute('/app/faq/ged/$faqId/import-files')({
  validateSearch: searchSchema,
});
