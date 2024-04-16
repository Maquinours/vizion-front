import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewFormationsViewDeleteModalView from '../../../../../views/App/views/Tools/views/Formations/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/formations/delete/$formationId')({
  component: AppViewToolsViewFormationsViewDeleteModalView,
});
