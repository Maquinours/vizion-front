import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/delivery/create-detail')({
  pendingComponent: LoaderModal,
});
