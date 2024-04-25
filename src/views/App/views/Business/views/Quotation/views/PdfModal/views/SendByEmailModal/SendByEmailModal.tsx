import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/pdf/send-by-email');

export default function AppViewBusinessViewQuotationViewPdfModalViewSendByEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { business, quotation, representative, commercialNoticeFile, quotationPdfFile } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      defaultAttachments={[quotationPdfFile, commercialNoticeFile]}
      defaultRecipient={[business.profileEmail!]}
      defaultCc={representative?.profiles.filter((profile) => profile.civility === 'Service').map((service) => service.email!)}
      defaultSubject={`Devis ${quotation.number} ${business.title ?? ''}`}
      defaultContent={`Bonjour <br /><p>Suite à votre demande, ci-joint le devis ainsi que les documents avec :</p> <br /><ul><li>Offre de prix HT</li><li>Dossier technique</li><li>Notices commerciales</li></ul><br /><br />`}
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
