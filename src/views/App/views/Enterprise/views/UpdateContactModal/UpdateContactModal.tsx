import { getRouteApi } from '@tanstack/react-router';
import UpdateContactModalComponent from '../../../../../../components/UpdateContactModal/UpdateContactModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/update-contact/$contactId');

export default function AppViewEnterpriseViewUpdateContactModalView() {
  const navigate = routeApi.useNavigate();

  const { contactId } = routeApi.useParams();

  return <UpdateContactModalComponent contactId={contactId} onClose={() => navigate({ to: '../..', search: true, replace: true, resetScroll: false })} />;
}
