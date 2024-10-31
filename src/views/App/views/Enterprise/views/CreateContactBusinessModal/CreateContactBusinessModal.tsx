import { getRouteApi } from '@tanstack/react-router';
import CreateBusinessModalComponent from '../../../../../../components/CreateBusinessModal/CreateBusinessModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/create-contact-business/$contactId');

export default function AppViewEnterpriseViewCreateContactBusinessModalView() {
  const navigate = routeApi.useNavigate();

  const { contactId } = routeApi.useParams();

  return <CreateBusinessModalComponent contactId={contactId} onClose={() => navigate({ to: '../..', search: true, replace: true, resetScroll: false })} />;
}
