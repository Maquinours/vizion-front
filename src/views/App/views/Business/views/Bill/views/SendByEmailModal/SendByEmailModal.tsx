import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bill/send-by-email');

export default function AppViewBusinessViewBillViewSendByEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { business, bill, file, enterprise } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      predefinedMessagesModalLink={{
        to: '/app/businesses-rma/business/$businessId/bill/send-by-email/predefined-messages',
        search: true,
        replace: true,
        resetScroll: false,
      }}
      defaultSubject={`Facture ${bill.number}`}
      defaultContent="Bonjour, <br /> <br />Ci-joint, votre facture."
      defaultAttachments={[file]}
      defaultRecipient={[
        (business.enterpriseName === 'DIVERS CLIENTS' ? business.billingEmail : enterprise.accountability?.accountingEmail) ?? 'rg@vizeo.eu',
        '43.vizeoo@ged.ma-comptabilite.com',
      ]}
      lifeSheetInfoDto={{
        businessNumber: business.numBusiness,
        enterpriseName: business.enterpriseName,
        businessName: business.title ?? undefined,
        businessId: business.id,
        enterpriseId: business.enterpriseId,
      }}
    />
  );
}
