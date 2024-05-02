import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewDepartmentsViewDeleteModalView from '../../../../../views/App/views/Tools/views/Departments/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/departments/delete/$departmentId')({
  component: AppViewToolsViewDepartmentsViewDeleteModalView,
});
