import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewCreateFaqModalView from '../../../../../../views/App/views/Assistance/views/CreateFaqModal/CreateFaqModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-faq')({
  component: AppViewAssistanceViewCreateFaqModalView,
});
