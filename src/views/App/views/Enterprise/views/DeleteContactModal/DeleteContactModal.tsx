import { getRouteApi, useNavigate } from '@tanstack/react-router';
import DeleteContactModalComponent from '../../../../../../components/DeleteContactModal/DeleteContactModal';

const Route = getRouteApi('/app/enterprises/$enterpriseId/delete-contact/$contactId');

export default function AppViewEnterpriseViewDeleteContactModalView() {
  const navigate = useNavigate();

  const { contactId } = Route.useParams();

  return (
    <DeleteContactModalComponent
      contactId={contactId}
      onClose={() => navigate({ from: Route.id, to: '../..', search: (old) => old, replace: true, resetScroll: false })}
    />
  );
}
