import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/delivery/pdf/send-by-email');

export default function AppViewRmaViewDeliveryViewPdfModalViewSendByEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { rma, file } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <SendEmailModalComponent
      isOpen
      onClose={onClose}
      predefinedMessagesModalLink={{
        to: '/app/businesses-rma/rma/$rmaId/delivery/pdf/send-by-email/predefined-messages',
        params: true,
        search: true,
        replace: true,
        resetScroll: false,
      }}
      defaultRecipient={rma.addressEmail ? [rma.addressEmail] : undefined}
      defaultSubject={`RMA / Solution ${rma.number}`}
      defaultAttachments={[file]}
      lifeSheetInfoDto={{
        rmaNumber: rma.number,
        enterpriseName: rma.enterpriseName,
        rmaId: rma.id,
        enterpriseId: rma.enterpriseId,
      }}
    />
  );
}