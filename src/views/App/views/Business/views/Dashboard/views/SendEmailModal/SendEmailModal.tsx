import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/send-email');

export default function AppViewBusinessViewDashboardViewSendEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      predefinedMessagesModalLink={{
        to: '/app/businesses-rma/business/$businessId/dashboard/send-email/predefined-messages',
        search: true,
        replace: true,
        resetScroll: false,
        ignoreBlocker: true,
      }}
      defaultSubject={`${business.numBusiness} - ${business.title}`}
      defaultRecipient={business.profileEmail ? [business.profileEmail] : undefined}
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
