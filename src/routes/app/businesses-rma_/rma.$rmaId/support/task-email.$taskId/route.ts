import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/support/task-email/$taskId')({
  pendingComponent: LoaderModal,
});
