import { getRouteApi, useNavigate } from '@tanstack/react-router';
import UpdateContactModalComponent from '../../../../../../components/UpdateContactModal/UpdateContactModal';

const Route = getRouteApi('/app/enterprises/$enterpriseId/update-contact/$contactId');

export default function AppViewEnterpriseViewUpdateContactModalView() {
  const navigate = useNavigate();

  const { contactId } = Route.useParams();

  return (
    <UpdateContactModalComponent
      contactId={contactId}
      onClose={() => navigate({ from: Route.id, to: '../..', search: (old) => old, replace: true, resetScroll: false })}
    />
  );
}
