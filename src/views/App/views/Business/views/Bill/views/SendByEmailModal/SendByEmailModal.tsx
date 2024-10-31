import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bill/send-by-email');

export default function AppViewBusinessViewBillViewSendByEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { business, bill, file, enterprise } = routeApi.useLoaderData();

  const defaultRecipient = useMemo(
    () =>
      [enterprise.accountability?.accountingEmail ?? business.billingEmail, '43.vizeoo@ged.ma-comptabilite.com'].filter(
        (address): address is string => !!address,
      ),
    [enterprise.accountability?.accountingEmail, business.billingEmail],
  );

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
      defaultRecipient={defaultRecipient}
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
