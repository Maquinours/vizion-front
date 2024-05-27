import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/menu/create-enterprise/add-contact')({
  pendingComponent: LoaderModal,
});
