import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewRepresentativesMapView from '../../../../views/App/views/Tools/views/RepresentativesMap/RepresentativesMap';

export const Route = createLazyFileRoute('/app/tools/representatives-map')({
  component: AppViewToolsViewRepresentativesMapView,
});
