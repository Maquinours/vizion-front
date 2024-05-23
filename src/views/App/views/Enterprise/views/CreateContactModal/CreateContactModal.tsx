import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateContactModalComponent from '../../../../../../components/CreateContactModal/CreateContactModal';

const Route = getRouteApi('/app/enterprises/$enterpriseId/create-contact');

export default function AppViewEnterpriseViewCreateContactModalView() {
  const navigate = useNavigate();

  const { enterpriseId } = Route.useParams();

  const onClose = () => {
    navigate({ from: Route.id, to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  return <CreateContactModalComponent enterpriseId={enterpriseId} onClose={onClose} />;
}
