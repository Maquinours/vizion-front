import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/address-book/create')({
  pendingComponent: LoaderModal,
});