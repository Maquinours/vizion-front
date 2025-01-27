import { getRouteApi } from '@tanstack/react-router';
import CreateEnterpriseModalComponent from '../../../../../../components/CreateEnterpriseModal/CreateEnterpriseModal';

const routeApi = getRouteApi('/app/enterprises/create');

export default function AppViewEnterprisesViewCreateModalView() {
  const navigate = routeApi.useNavigate();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <CreateEnterpriseModalComponent onClose={onClose} />;
}
