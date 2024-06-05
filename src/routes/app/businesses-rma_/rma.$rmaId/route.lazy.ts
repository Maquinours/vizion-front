import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaView from '../../../../views/App/views/Rma/Rma';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId')({
  component: AppViewRmaView,
});