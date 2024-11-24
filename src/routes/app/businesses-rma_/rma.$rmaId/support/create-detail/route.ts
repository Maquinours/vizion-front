import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma_/rma/$rmaId/support/create-detail')({
  pendingComponent: LoaderModal,
});
