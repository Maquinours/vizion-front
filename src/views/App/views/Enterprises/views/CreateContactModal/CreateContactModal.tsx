import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateContactModalComponent from '../../../../../../components/CreateContactModal/CreateContactModal';

const routeApi = getRouteApi('/app/enterprises/create-contact/$enterpriseId');

export default function AppViewEnterprisesViewCreateContactModalView() {
  const navigate = useNavigate();

  const { enterpriseId } = routeApi.useParams();

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  return <CreateContactModalComponent enterpriseId={enterpriseId} onClose={onClose} />;
}
