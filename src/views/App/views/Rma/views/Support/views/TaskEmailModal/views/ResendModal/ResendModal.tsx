import { getRouteApi } from '@tanstack/react-router';
import ResendEmailModalComponent from '../../../../../../../../../../components/ResendEmailModal/ResendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/task-email/$taskId/resend');

export default function AppViewRmaViewSupportViewTaskEmailModalViewResendModalView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <ResendEmailModalComponent isOpen email={email} onClose={onClose} />;
}
