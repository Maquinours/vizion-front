import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  gedObjectRelativePath: z
    .string()
    .transform((data) => decodeURIComponent(data))
    .catch(''),
});

export const Route = createFileRoute('/app/enterprises/$enterpriseId/create-ged-directory')({
  validateSearch: searchSchema,
});
