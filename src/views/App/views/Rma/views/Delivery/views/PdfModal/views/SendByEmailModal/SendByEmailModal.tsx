import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/delivery/pdf/send-by-email');

export default function AppViewRmaViewDeliveryViewPdfModalViewSendByEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { rma, file } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <SendEmailModalComponent
      isOpen
      onClose={onClose}
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
