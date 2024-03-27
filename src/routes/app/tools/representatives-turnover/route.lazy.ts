import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewRepresentativesTurnoverView from '../../../../views/App/views/Tools/views/RepresentativesTurnover/RepresentativesTurnover';

export const Route = createLazyFileRoute('/app/tools/representatives-turnover')({
  component: AppViewToolsViewRepresentativesTurnoverView,
});
