import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';
import _ from 'lodash';
import { useMemo } from 'react';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bl/send-by-email');

export default function AppViewBusinessViewBlViewSendByEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { business, bl, file } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const defaultRecipient = useMemo(
    () => _.uniq([business.billingEmail, business.deliverEmail].filter((email): email is string => !!email).map((email) => email.toLowerCase())),
    [],
  );

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      predefinedMessagesModalLink={{
        to: '/app/businesses-rma/business/$businessId/bl/send-by-email/predefined-messages',
        search: true,
        replace: true,
        resetScroll: false,
      }}
      defaultRecipient={defaultRecipient}
      defaultSubject={bl.number}
      defaultAttachments={[file]}
      lifeSheetInfoDto={{
        businessNumber: business.numBusiness,
        enterpriseName: business.enterpriseName,
        businessName: business.title ?? '',
        businessId: business.id,
        enterpriseId: business.enterpriseId,
      }}
    />
  );
}
