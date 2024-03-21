import { createLazyFileRoute } from '@tanstack/react-router';
import CreateEnterpriseRmaModal from '../../../../views/App/views/Enterprises/views/CreateEnterpriseRmaModal/CreateEnterpriseRmaModal';

export const Route = createLazyFileRoute('/app/enterprises/create-enterprise-rma/$enterpriseId')({
  component: CreateEnterpriseRmaModal,
});
