import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises_/$enterpriseId/import-contacts')({
  pendingComponent: LoaderModal,
});
