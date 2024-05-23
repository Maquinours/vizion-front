import { getRouteApi, useNavigate } from '@tanstack/react-router';
import UpdateContactPasswordModalComponent from '../../../../../../components/UpdateContactPasswordModal/UpdateContactPasswordModal';

const routeApi = getRouteApi('/app/enterprises/update-contact-password/$contactId');

export default function AppViewEnterprisesViewUpdateContactPasswordModalView() {
  const navigate = useNavigate();

  const { contactId } = routeApi.useParams();

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true });
  };

  return <UpdateContactPasswordModalComponent contactId={contactId} onClose={onClose} />;
}
