import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { createBusinessArc } from '../../../../../../../../../../utils/api/businessArcs';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../../../../../utils/enums/BusinessState';
import BusinessArcDetailsRequestDto from '../../../../../../../../../../utils/types/BusinessArcDetailsRequestDto';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import styles from './SectionOne.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation');
const routePath = '/app/businesses-rma/business/$businessId/quotation';

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionOneComponent() {
  const navigate = routeApi.useNavigate();
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const { mutate: createArc, isPending: isCreateArcPending } = useMutation({
    mutationFn: async () => {
      const stocks = await queryClient.ensureQueryData(queries['product-stocks'].list._ctx.all);

      return createBusinessArc({
        number: quotation.number,
        documentName: `ARC`,
        shippingServicePrice: quotation.shippingServicePrice,
        vat: quotation.vat,
        numOrder: null,
        businessId: business.id,
        arcDetailsList: quotation.subQuotationList?.reduce(
          (acc: Array<BusinessArcDetailsRequestDto>, subQuotation) => [
            ...acc,
            ...(subQuotation.quotationDetails?.map((detail) => ({
              numDetails: detail.numDetails,
              productId: detail.productId,
              productReference: detail.productReference,
              quantity: detail.quantity,
              productDesignation: detail.productDesignation,
              productName: detail.productName,
              reduction: detail.reduction,
              publicUnitPrice: detail.publicUnitPrice,
              unitPrice: detail.unitPrice,
              totalPrice: detail.totalPrice,
              taxDEEE: detail.taxDEEE,
              virtualQty: detail.virtualQty,
              bom: detail.bom,
              stock: detail.virtualQty || detail.bom || (stocks?.find((stock) => stock.reference === detail.productReference)?.currentStock ?? 0) > 0,
            })) ?? []),
          ],
          [],
        ),
        totalAmount: quotation.totalAmount,
        totalAmountHT: quotation.totalAmountHT,
        bom: quotation.bom,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries.businesses.detail._ctx.byId(business.id).queryKey });
      queryClient.setQueryData(queries['business-ARCs'].detail._ctx.byBusinessId(business.id).queryKey, data);
      toast.success('ARC créé avec succès');
      navigate({ to: '../arc', replace: true });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'ARC");
    },
  });

  const onArcButtonClick = () => {
    if (business.state !== BusinessState.DEVIS) {
      navigate({ to: '../arc', replace: true });
      return;
    }

    const detailsList = quotation.subQuotationList?.map((quote) => quote.quotationDetails ?? []) ?? [];
    if (!detailsList.some((details) => details.length > 0)) {
      toast.warning('Veuillez ajouter un produit dans le devis.');
      return;
    }
    // if (quotation.totalAmount !== totalAmountTTC || Number(currentBusinessQuote?.totalAmountHT) !== Number(totalAmountHT)) { // TODO: reimplement this
    //   toast.warning('Veuillez sauvegarder le devis avant de passer en ARC');
    //   return;
    // }
    createArc();
  };

  return (
    <div className={styles.header}>
      <div className={styles.business_info}>
        <span>{business.enterpriseName}</span> / <span>{business.title}</span>
        <span className="ml-2 text-xl text-(--primary-color)">{business.numBusiness}</span>
      </div>
      <div className={styles.buttons_container}>
        <Link from={routePath} to="../study" className="btn btn-secondary">
          Accès à l&apos;étude
        </Link>
        <Link from={routePath} to="commercial-notice" search replace resetScroll={false} preload="intent" ignoreBlocker className="btn btn-primary">
          Générer les notices commerciales
        </Link>
        {/* {![BusinessState.FACTURE, BusinessState.ARC, BusinessState.BP, BusinessState.BL].includes(business.state!) ||
          (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && business.state === BusinessState.FACTURE && (
            <SaveQuotationButton business={business} quotation={quotation} handleSubmit={handleSubmit} /> // TODO: reimplement this
          ))} */}
        {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && !business.archived && (
          <button className="btn btn-secondary" disabled={isCreateArcPending} onClick={() => onArcButtonClick()}>
            {isCreateArcPending ? "Création de l'ARC..." : 'Passer en ARC'}
          </button>
        )}
      </div>
    </div>
  );
}
