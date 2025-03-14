import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import LoaderModal from '../../../../../../../../../../../../../../components/LoaderModal/LoaderModal';
import SendEmailModalComponent from '../../../../../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

type AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentSendByEmailModalViewProps = Readonly<{
  file: File;
  onClose: () => void;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentSendByEmailModalView({
  file,
  onClose,
}: AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentSendByEmailModalViewProps) {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: department, isLoading: isLoadingDepartment } = useQuery({
    ...queries.departments.detail._ctx.byCode(business.deliveryDepartmentCode ?? ''),
    enabled: !!business.deliveryDepartmentCode,
  });
  const { data: representative, isLoading: isLoadingRepresentative } = useQuery({
    ...queries.enterprise.detail(department?.repEnterprise?.id ?? ''),
    enabled: !!department?.repEnterprise?.id,
  });

  if (isLoadingDepartment || isLoadingRepresentative) return <LoaderModal />;

  const defaultCc = representative?.profiles.filter((profile) => profile.civility === 'Service' && !!profile.email).map((service) => service.email!);
  const defaultRecipient = business.profileEmail ? [business.profileEmail] : [];
  const defaultSubject = `Étude ${business.numBusiness}${business.title ? ` ${business.title}` : ''}`;

  return (
    <SendEmailModalComponent
      isOpen
      onClose={onClose}
      defaultCc={defaultCc}
      defaultRecipient={defaultRecipient}
      defaultSubject={defaultSubject}
      defaultAttachments={[file]}
      lifeSheetInfoDto={{
        businessNumber: business.numBusiness,
        businessName: business.title,
        businessId: business.id,
      }}
    />
  );
}
