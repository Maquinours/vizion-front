import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId/pdf/send-by-email');

export default function AppViewAssistanceViewPdfModalViewSendByEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { assistance, file } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: (old) => old });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      predefinedMessagesModalLink={{
        to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/pdf/send-by-email/predefined-messages',
        search: true,
        replace: true,
        resetScroll: false,
      }}
      defaultSubject={`Assistance ${assistance.businessNumber}`}
      defaultAttachments={[file]}
    />
  );
}
