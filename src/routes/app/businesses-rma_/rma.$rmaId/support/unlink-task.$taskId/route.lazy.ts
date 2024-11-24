import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewUnlinkTaskModalView from '../../../../../../views/App/views/Rma/views/Support/views/UnlinkTaskModal/UnlinkTaskModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support/unlink-task/$taskId')({
  component: AppViewRmaViewSupportViewUnlinkTaskModalView,
});
