import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import { pdf } from '@react-pdf/renderer';
import AppViewBusinessViewQuotationViewPdfModalViewPdfComponent from '../../components/Pdf/Pdf';
import { useMemo } from 'react';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/pdf/send-by-email');

export default function AppViewBusinessViewQuotationViewPdfModalViewSendByEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();
  const { hideAddresses, hideReferences, hidePrices, hideTotal } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(business.id));
  const { data: department } = useSuspenseQuery(queries.departments.detail._ctx.byCode(business.deliveryDepartmentCode!));
  const { data: representative } = useSuspenseQuery(queries.enterprise.detail(department.repEnterprise!.id));
  const references = useMemo(
    () =>
      (quotation.subQuotationList
        ?.flatMap((subQuotation) => subQuotation.quotationDetails?.map((detail) => detail.productReference))
        ?.filter((reference) => reference !== null) ?? []) as string[],
    [quotation],
  );
  const { data: commercialNoticeUrl } = useSuspenseQuery({
    ...queries['commercial-notices'].data._ctx.byProductReferences(references),
    select: (data) => `data:application/pdf;base64,${data}`,
    staleTime: Infinity,
  });
  const { data: commercialNoticeFile } = useSuspenseQuery({
    queryKey: ['base64-to-file', commercialNoticeUrl],
    queryFn: async () => {
      const res: Response = await fetch(commercialNoticeUrl);
      const blob: Blob = await res.blob();
      return new File([blob], 'DOC_COMMERCIAL_VIZEO.pdf', { type: blob.type });
    },
  });
  const { data: quotationPdf } = useSuspenseQuery({
    queryKey: ['pdf-to-file', 'quotation', businessId, quotation.number, hideAddresses, hideReferences, hidePrices, hideTotal],
    queryFn: async () => {
      const blob = await pdf(
        <AppViewBusinessViewQuotationViewPdfModalViewPdfComponent
          business={business}
          quotation={quotation}
          hideAddresses={hideAddresses}
          hideReferences={hideReferences}
          hidePrices={hidePrices}
          hideTotal={hideTotal}
        />,
      ).toBlob();
      const file = new File([blob], `Devis-${quotation.number}.pdf`.replace(/\s|-/g, '_'), {
        type: blob.type,
      });
      return file;
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      defaultAttachments={[quotationPdf, commercialNoticeFile]}
      defaultRecipient={[business.profileEmail!]}
      defaultCc={representative?.profiles.filter((profile) => profile.civility === 'Service').map((service) => service.email!)}
      defaultSubject={`Devis ${quotation.number} ${business.title ?? ''}`}
      defaultContent={`Bonjour <br /><p>Suite à votre demande, ci-joint le devis ainsi que les documents avec :</p> <br /><ul><li>Offre de prix HT</li><li>Dossier technique</li><li>Notices commerciales</li></ul><br /><br />`}
      lifeSheetInfoDto={{
        businessNumber: business.numBusiness,
        enterpriseName: business.enterpriseName,
        author: `${user.userInfo.firstName} ${user.userInfo.lastName.charAt(0)}.`,
        businessName: business.title ?? '',
        businessId: business.id,
        enterpriseId: business.enterpriseId,
      }}
    />
  );
}
