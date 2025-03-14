import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import ProfileResponseDto from '../../../../../../../../../../utils/types/ProfileResponseDto';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc/pdf/send-by-email');

export default function AppViewBusinessViewArcViewPdfModalViewSendByEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { business, arc, representative, file } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const recipient = business.profileEmail ?? business.deliverEmail ?? undefined;

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      defaultRecipient={recipient ? [recipient] : undefined}
      defaultCc={representative?.profiles
        .filter(
          (profile): profile is ProfileResponseDto & { email: NonNullable<ProfileResponseDto['email']> } => profile.civility === 'Service' && !!profile.email,
        )
        .map((service) => service.email)}
      defaultSubject={`Arc ${arc.number}`}
      defaultAttachments={[file]}
      lifeSheetInfoDto={{
        businessNumber: business.numBusiness,
        businessName: business.title ?? '',
        businessId: business.id,
      }}
    />
  );
}
