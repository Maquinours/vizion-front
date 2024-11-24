import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewImportContactsModalView from '../../../../views/App/views/Enterprise/views/ImportContactsModal/ImportContactsModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/import-contacts')({
  component: AppViewEnterpriseViewImportContactsModalView,
});
