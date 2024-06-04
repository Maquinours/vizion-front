import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bl/send-by-email');

export default function AppViewBusinessViewBlViewSendByEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { business, bl, file } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      defaultRecipient={business.profileEmail ? [business.profileEmail] : undefined}
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
