import { createLazyFileRoute } from '@tanstack/react-router';
import RepresentativesTurnoverView from '../../../../views/App/views/RepresentativesTurnover/RepresentativesTurnover';

export const Route = createLazyFileRoute('/app/tools/representatives-turnover')({
  component: RepresentativesTurnoverView,
});
