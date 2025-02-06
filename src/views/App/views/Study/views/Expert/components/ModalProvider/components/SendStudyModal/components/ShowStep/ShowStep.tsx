import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import EnterpriseResponseDto from '../../../../../../../../../../../../utils/types/EnterpriseResponseDto';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

type AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentShowStepComponentProps = Readonly<{
  onClose: () => void;
  studyPdf: File;
  quotationPdf: File;
  commercialNoticePdf: File | null;
  representative: EnterpriseResponseDto | undefined;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentShowStepComponent({
  onClose,
  studyPdf,
  quotationPdf,
  commercialNoticePdf,
  representative,
}: AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentShowStepComponentProps) {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const defaultCc = representative?.profiles.filter((profile) => profile.civility === 'Service' && !!profile.email).map((service) => service.email!);
  const defaultRecipient = business.profileEmail ? [business.profileEmail] : [];
  const defaultSubject = `Étude ${business.numBusiness}${business.title ? ` ${business.title}` : ''}`;
  const defaultAttachments = [studyPdf, quotationPdf, commercialNoticePdf].filter((file): file is File => !!file);
  const defaultContent = `Bonjour <br /><p>Suite a votre demande, ci joint votre dossier complet avec :</p> <br /><ul><li>Offre de prix HT pour vous</li><li>Dossier technique pour votre client</li>${commercialNoticePdf ? `<li>Notices commerciales pour votre client</li>` : ''}</ul>`;

  return (
    <SendEmailModalComponent
      isOpen
      onClose={onClose}
      defaultCc={defaultCc}
      defaultRecipient={defaultRecipient}
      defaultSubject={defaultSubject}
      defaultAttachments={defaultAttachments}
      defaultContent={defaultContent}
      lifeSheetInfoDto={{
        businessNumber: business.numBusiness,
        enterpriseName: business.enterpriseName,
        businessName: business.title,
        businessId: business.id,
        enterpriseId: business.enterpriseId,
      }}
    />
  );
}
