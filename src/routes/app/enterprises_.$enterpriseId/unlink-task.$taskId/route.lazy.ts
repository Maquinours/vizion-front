import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewUnlinkTaskModalView from '../../../../views/App/views/Enterprise/views/UnlinkTaskModal/UnlinkTaskModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/unlink-task/$taskId')({
  component: AppViewEnterpriseViewUnlinkTaskModalView,
});
