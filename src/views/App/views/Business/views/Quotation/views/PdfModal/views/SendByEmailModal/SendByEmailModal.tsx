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
      predefinedMessagesModalLink={{
        to: '/app/businesses-rma/business/$businessId/quotation/pdf/send-by-email/predefined-messages',
        search: true,
        replace: true,
        resetScroll: false,
        ignoreBlocker: true,
      }}
      defaultAttachments={[quotationPdfFile, commercialNoticeFile]}
      defaultRecipient={defaultRecipient}
      defaultCc={representative?.profiles
        .filter((profile) => profile.civility === 'Service')
        .map((service) => service.email!)
        .filter((email) => !!email)}
      defaultSubject={`Devis ${quotation.number} ${business.title ?? ''}`}
      defaultContent={`Bonjour <br /><br /><p>Suite à votre demande, ci-joint le devis ainsi que les documents avec :</p> <br /><ul><li>Offre de prix HT pour vous</li><li>Dossier technique pour votre client</li><li>Notices commerciales pour votre client</li></ul>`}
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
