import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/pdf/send-by-email');

export default function AppViewAssistanceViewPdfModalViewSendByEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { assistance, file } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <SendEmailModalComponent isOpen={true} onClose={onClose} defaultSubject={`Assistance ${assistance.businessNumber}`} defaultAttachments={[file]} />;
}
