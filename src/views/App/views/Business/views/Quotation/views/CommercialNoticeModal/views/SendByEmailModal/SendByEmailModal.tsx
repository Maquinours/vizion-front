import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/commercial-notice/send-by-email');

export default function AppViewBusinessViewQuotationViewCommercialNoticeModalViewSendByEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: references } = useSuspenseQuery({
    ...queries['business-quotations'].detail._ctx.byBusinessId(business.id),
    select: (data) =>
      (data.subQuotationList
        ?.flatMap((subQuotation) => subQuotation.quotationDetails?.map((detail) => detail.productReference))
        ?.filter((reference) => reference !== null) ?? []) as string[],
  });
  const { data: commercialNoticeUrl } = useSuspenseQuery({
    ...queries['commercial-notices'].data._ctx.byProductReferences(references),
    select: (data) => `data:application/pdf;base64,${data}`,
    staleTime: Infinity,
  });
  const { data: department } = useSuspenseQuery(queries.departments.detail._ctx.byCode(business.deliveryDepartmentCode!));
  const { data: representative } = useSuspenseQuery(queries.enterprise.detail(department.repEnterprise!.id));
  const { data: commercialNoticeFile } = useSuspenseQuery({
    queryKey: ['base64-to-file', commercialNoticeUrl],
    queryFn: async () => {
      const res: Response = await fetch(commercialNoticeUrl);
      const blob: Blob = await res.blob();
      return new File([blob], 'DOC_COMMERCIAL_VIZEO.pdf', { type: blob.type });
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={onClose}
      predefinedMessagesModalLink={{
        to: '/app/businesses-rma/business/$businessId/quotation/commercial-notice/send-by-email/predefined-messages',
        search: true,
        replace: true,
        resetScroll: false,
      }}
      defaultRecipient={[business.profileEmail!]}
      defaultCc={representative?.profiles.filter((profile) => profile.civility === 'Service').map((service) => service.email!)}
      defaultSubject={`Devis ${business.numBusiness}`}
      defaultContent="Bonjour <br /><p>Suite à votre demande,</p><h4>Ci-joint la notice commerciale des différents produits de votre devis.</h4>"
      defaultAttachments={[commercialNoticeFile]}
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
