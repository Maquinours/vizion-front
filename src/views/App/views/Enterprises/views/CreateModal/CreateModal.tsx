import { getRouteApi } from '@tanstack/react-router';
import CreateEnterpriseModalComponent from '../../../../../../components/CreateEnterpriseModal/CreateEnterpriseModal';

const routeApi = getRouteApi('/app/enterprises/create');

export default function AppViewEnterprisesViewCreateModalView() {
  const navigate = routeApi.useNavigate();

  const { defaultContactPhoneNumber } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, defaultContactPhoneNumber: undefined }), replace: true, resetScroll: false });
  };

  return <CreateEnterpriseModalComponent onClose={onClose} defaultContactPhoneNumber={defaultContactPhoneNumber} />;
}
