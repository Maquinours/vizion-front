import { getRouteApi } from '@tanstack/react-router';
import CreateContactModalComponent from '../../../../../../components/CreateContactModal/CreateContactModal';

const routeApi = getRouteApi('/app/enterprises/create-contact/$enterpriseId');

export default function AppViewEnterprisesViewCreateContactModalView() {
  const navigate = routeApi.useNavigate();

  const { enterpriseId } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <CreateContactModalComponent enterpriseId={enterpriseId} onClose={onClose} />;
}
