import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewReceptionView from '../../../../../views/App/views/Rma/views/Reception/Reception';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/reception')({
  component: AppViewRmaViewReceptionView,
});