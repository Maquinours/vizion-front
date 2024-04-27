import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewDepartmentsViewUpdateModalView from '../../../../../views/App/views/Tools/views/Departments/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/departments/update/$departmentId')({
  component: AppViewToolsViewDepartmentsViewUpdateModalView,
});
