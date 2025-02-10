import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/send-email');

export default function AppViewBusinessViewDashboardViewSendEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { business } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      defaultSubject={`${business.numBusiness} - ${business.title}`}
      defaultRecipient={business.profileEmail ? [business.profileEmail] : undefined}
    />
  );
}
