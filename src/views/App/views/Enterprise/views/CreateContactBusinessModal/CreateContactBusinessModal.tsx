import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateBusinessModalComponent from '../../../../../../components/CreateBusinessModal/CreateBusinessModal';

const Route = getRouteApi('/app/enterprises/$enterpriseId/create-contact-business/$contactId');

export default function AppViewEnterpriseViewCreateContactBusinessModalView() {
  const navigate = useNavigate();

  const { contactId } = Route.useParams();

  return <CreateBusinessModalComponent contactId={contactId} onClose={() => navigate({ from: Route.id, to: '../..', search: (old) => old, replace: true })} />;
}
