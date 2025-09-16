import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

const searchSchema = z.object({
  tasksId: z.array(z.uuid()).min(1),
});

export const Route = createFileRoute('/app/dashboard/delete-collective-tasks')({
  validateSearch: searchSchema,
  pendingComponent: LoaderModal,
});
