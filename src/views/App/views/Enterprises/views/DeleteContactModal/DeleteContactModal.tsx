import { getRouteApi, useNavigate } from '@tanstack/react-router';
import DeleteContactModalComponent from '../../../../../../components/DeleteContactModal/DeleteContactModal';

const routeApi = getRouteApi('/app/enterprises/delete-contact/$contactId');

export default function AppViewEnterprisesViewDeleteContactModal() {
  const navigate = useNavigate();

  const { contactId } = routeApi.useParams();

  return (
    <DeleteContactModalComponent contactId={contactId} onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true })} />
  );
}
