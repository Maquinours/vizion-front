import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation/pdf/send-by-email');

export default function AppViewBusinessViewQuotationViewPdfModalViewSendByEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { business, quotation, representative, commercialNoticeFile, quotationPdfFile } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const defaultRecipient = (() => {
    if (business.enterpriseName === 'DIVERS CLIENTS') {
      if (business.billingEmail) return [business.billingEmail];
    } else if (business.profileEmail) return [business.profileEmail];
  })();

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      defaultAttachments={[quotationPdfFile, commercialNoticeFile]}
      defaultRecipient={defaultRecipient}
      defaultCc={representative?.profiles
        .filter((profile) => profile.civility === 'Service')
        .map((service) => service.email!)
        .filter((email) => !!email)}
      defaultSubject={`Devis ${quotation.number} ${business.title ?? ''}`}
      defaultContent={`Bonjour <br /><br /><p>Suite à la demande, ci-joint le devis, accompagné des documents suivants :</p> <br /><ul><li>L'offre de prix HT</li><li>Le dossier technique pour le client</li><li>Les notices commerciales pour le client</li></ul>`}
      lifeSheetInfoDto={{
        businessNumber: business.numBusiness,
        businessName: business.title ?? '',
        businessId: business.id,
      }}
    />
  );
}
