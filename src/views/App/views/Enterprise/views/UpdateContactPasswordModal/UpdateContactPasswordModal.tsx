import { getRouteApi, useNavigate } from '@tanstack/react-router';
import UpdateContactPasswordModalComponent from '../../../../../../components/UpdateContactPasswordModal/UpdateContactPasswordModal';

const Route = getRouteApi('/app/enterprises/$enterpriseId/update-contact-password/$contactId');

export default function AppViewEnterpriseViewUpdateContactPasswordView() {
  const navigate = useNavigate();

  const { contactId } = Route.useParams();

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old });
  };

  return <UpdateContactPasswordModalComponent contactId={contactId} onClose={onClose} />;
}
