import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/pdf/send-by-email');

export default function AppViewRmaViewSupportViewPdfModalViewSendByEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { rma, file } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      defaultRecipient={[rma.addressEmail ?? '']}
      defaultSubject={`RMA / Prise en charge ${rma.number}`}
      lifeSheetInfoDto={{
        rmaNumber: rma.number,
        rmaId: rma.id,
      }}
      defaultAttachments={[file]}
    />
  );
}
