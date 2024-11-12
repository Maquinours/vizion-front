import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bill/credits/send-by-email');

export default function AppViewBusinessViewBillViewCreditsModalViewSendByEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { enterprise, credit, file, business } = routeApi.useLoaderData();

  const defaultRecipient = useMemo(
    () =>
      [enterprise.accountability?.accountingEmail ?? business.billingEmail, '43.vizeoo@ged.ma-comptabilite.com'].filter(
        (address): address is string => !!address,
      ),
    [enterprise.accountability?.accountingEmail, business.billingEmail],
  );

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      predefinedMessagesModalLink={{
        to: '/app/businesses-rma/business/$businessId/bill/credits/send-by-email/predefined-messages',
        search: true,
        replace: true,
        resetScroll: false,
      }}
      defaultSubject={`Avoir ${credit.number}`}
      defaultContent="Ci-joint, votre avoir."
      defaultAttachments={[file]}
      defaultRecipient={defaultRecipient}
    />
  );
}
