import { getRouteApi } from '@tanstack/react-router';
import UpdateContactModalComponent from '../../../../../../components/UpdateContactModal/UpdateContactModal';

const routeApi = getRouteApi('/app/enterprises/update-contact/$contactId');

export default function AppViewEnterprisesViewUpdateContactModalView() {
  const navigate = routeApi.useNavigate();

  const { contactId } = routeApi.useParams();

  return (
    <UpdateContactModalComponent contactId={contactId} onClose={() => navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false })} />
  );
}
