import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewStudyViewExpertView from '../../../../../../views/App/views/Study/views/Expert/Expert';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/study/expert')({
  component: AppViewStudyViewExpertView,
});
