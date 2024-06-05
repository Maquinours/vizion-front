import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewStudyViewAutomaticView from '../../../../../../views/App/views/Study/views/Automatic/Automatic';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/study/automatic')({
  component: AppViewStudyViewAutomaticView,
});
