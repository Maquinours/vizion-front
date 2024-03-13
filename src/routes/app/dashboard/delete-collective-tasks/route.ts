import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  tasksId: z.array(z.string().uuid()).min(1),
});

export const Route = createFileRoute('/app/dashboard/delete-collective-tasks')({
  validateSearch: searchSchema,
});
