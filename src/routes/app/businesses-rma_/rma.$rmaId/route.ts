import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  rmaModal: z.enum(['archive']).optional(),
});

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId')({
  validateSearch: searchSchema,
});
