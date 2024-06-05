import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/predefined-texts/create')({
  pendingComponent: LoaderModal,
});