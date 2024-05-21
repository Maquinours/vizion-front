import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/rename-ged-object/$objectRelativePath')({
  pendingComponent: LoaderModal,
});
