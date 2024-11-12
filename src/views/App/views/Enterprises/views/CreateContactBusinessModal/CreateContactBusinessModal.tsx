import { getRouteApi } from '@tanstack/react-router';
import CreateBusinessModalComponent from '../../../../../../components/CreateBusinessModal/CreateBusinessModal';

const routeApi = getRouteApi('/app/enterprises/create-contact-business/$contactId');

export default function AppViewEnterprisesViewCreateContactBusinessModalView() {
  const navigate = routeApi.useNavigate();

  const { contactId } = routeApi.useParams();

  return <CreateBusinessModalComponent contactId={contactId} onClose={() => navigate({ to: '../..', search: true, replace: true, resetScroll: false })} />;
}
