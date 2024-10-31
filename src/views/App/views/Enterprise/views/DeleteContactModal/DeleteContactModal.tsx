import { getRouteApi } from '@tanstack/react-router';
import DeleteContactModalComponent from '../../../../../../components/DeleteContactModal/DeleteContactModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/delete-contact/$contactId');

export default function AppViewEnterpriseViewDeleteContactModalView() {
  const navigate = routeApi.useNavigate();

  const { contactId } = routeApi.useParams();

  return <DeleteContactModalComponent contactId={contactId} onClose={() => navigate({ to: '../..', search: true, replace: true, resetScroll: false })} />;
}
