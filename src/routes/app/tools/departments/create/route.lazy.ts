import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewDepartmentsViewCreateModalView from '../../../../../views/App/views/Tools/views/Departments/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/departments/create')({
  component: AppViewToolsViewDepartmentsViewCreateModalView,
});
