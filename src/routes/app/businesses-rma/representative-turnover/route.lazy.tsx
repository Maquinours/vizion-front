import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessesRmaViewRepresentativeTurnoverModalView from '../../../../views/App/views/BusinessesRma/views/RepresentativeTurnoverModal/RepresentativeTurnoverModal';

export const Route = createLazyFileRoute('/app/businesses-rma/representative-turnover')({
  component: AppViewBusinessesRmaViewRepresentativeTurnoverModalView,
});
