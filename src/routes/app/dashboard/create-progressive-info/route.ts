import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/dashboard/create-progressive-info')({
  pendingComponent: LoaderModal,
});
