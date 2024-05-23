import { getRouteApi, useNavigate } from '@tanstack/react-router';
import UpdateContactModalComponent from '../../../../../../components/UpdateContactModal/UpdateContactModal';

const routeApi = getRouteApi('/app/enterprises/update-contact/$contactId');

export default function AppViewEnterprisesViewUpdateContactModalView() {
  const navigate = useNavigate();

  const { contactId } = routeApi.useParams();

  return (
    <UpdateContactModalComponent contactId={contactId} onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true })} />
  );
}
