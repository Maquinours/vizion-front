import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  redirect: z.string().min(1).optional().catch(undefined),
});

export const Route = createFileRoute('/auth/login')({
  validateSearch: searchSchema,
});
