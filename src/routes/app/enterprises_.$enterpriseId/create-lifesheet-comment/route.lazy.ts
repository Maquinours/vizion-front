import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewCreateLifesheetCommentModalView from '../../../../views/App/views/Enterprise/views/CreateLifesheetCommentModal/CreateLifesheetCommentModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/create-lifesheet-comment')({
  component: AppViewEnterpriseViewCreateLifesheetCommentModalView,
});
