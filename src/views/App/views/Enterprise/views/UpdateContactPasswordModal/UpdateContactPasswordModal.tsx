import { getRouteApi } from '@tanstack/react-router';
import UpdateContactPasswordModalComponent from '../../../../../../components/UpdateContactPasswordModal/UpdateContactPasswordModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/update-contact-password/$contactId');

export default function AppViewEnterpriseViewUpdateContactPasswordView() {
  const navigate = routeApi.useNavigate();

  const { contactId } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <UpdateContactPasswordModalComponent contactId={contactId} onClose={onClose} />;
}
