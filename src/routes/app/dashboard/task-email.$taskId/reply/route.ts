import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/dashboard/task-email/$taskId/reply')({
  pendingComponent: LoaderModal,
});