import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import EnterpriseResponseDto from '../../../../../../../../../../../../utils/types/EnterpriseResponseDto';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study/expert');

type AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentShowStepComponentProps = Readonly<{
  onClose: () => void;
  studyPdf: File;
  quotationPdf: File;
  commercialNoticePdf: File;
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
  const defaultSubject = `Étude ${business.numBusiness}`;

  return (
    <SendEmailModalComponent
      isOpen
      onClose={onClose}
      defaultCc={defaultCc}
      defaultRecipient={defaultRecipient}
      defaultSubject={defaultSubject}
      defaultAttachments={[studyPdf, quotationPdf, commercialNoticePdf]}
      defaultContent="Bonjour <br /><p>Suite à votre demande, ci-joint le devis ainsi que les documents avec :</p> <br /><ul><li>Étude</li><li>Offre de prix HT</li><li>Dossier technique</li><li>Notices commerciales</li></ul><br /><br />"
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
