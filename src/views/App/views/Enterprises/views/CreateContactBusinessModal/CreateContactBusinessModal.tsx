import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateBusinessModalComponent from '../../../../../../components/CreateBusinessModal/CreateBusinessModal';

const routeApi = getRouteApi('/app/enterprises/create-contact-business/$contactId');

export default function AppViewEnterprisesViewCreateContactBusinessModalView() {
  const navigate = useNavigate();

  const { contactId } = routeApi.useParams();

  return <CreateBusinessModalComponent contactId={contactId} onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old })} />;
}
