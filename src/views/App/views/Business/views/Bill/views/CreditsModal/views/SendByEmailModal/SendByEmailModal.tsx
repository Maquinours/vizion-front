import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bill/credits/send-by-email');

export default function AppViewBusinessViewBillViewCreditsModalViewSendByEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { enterprise, credit, file } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      defaultSubject={`Avoir ${credit.number}`}
      defaultContent="Ci-joint, votre avoir."
      defaultAttachments={[file]}
      defaultRecipient={[enterprise.accountability?.accountingEmail ?? 'rg@vizeo.eu', '43.vizeoo@ged.ma-comptabilite.com']}
    />
  );
}
