import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/rename-ged-object/$objectRelativePath')({
  pendingComponent: LoaderModal,
});
