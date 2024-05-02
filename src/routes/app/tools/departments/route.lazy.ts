import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewDepartmentsView from '../../../../views/App/views/Tools/views/Departments/Departments';

export const Route = createLazyFileRoute('/app/tools/departments')({
  component: AppViewToolsViewDepartmentsView,
});
