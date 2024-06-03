import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/support/delete-ged-object/$relativePath')({
  pendingComponent: LoaderModal,
});
