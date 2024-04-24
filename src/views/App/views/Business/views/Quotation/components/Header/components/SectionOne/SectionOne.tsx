import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../../../../../utils/enums/BusinessState';
import styles from './SectionOne.module.scss';
import { createBusinessArc } from '../../../../../../../../../../utils/api/businessArcs';
import BusinessArcDetailsRequestDto from '../../../../../../../../../../utils/types/BusinessArcDetailsRequestDto';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation');

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionOneComponent() {
  const queryClient = useQueryClient();
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const { mutate: createArc, isPending: isCreateArcPending } = useMutation({
    mutationFn: () =>
      createBusinessArc({
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
            })) ?? []),
          ],
          [],
        ),
        totalAmount: quotation.totalAmount,
        totalAmountHT: quotation.totalAmountHT,
        bom: quotation.bom,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-ARCs']._def });
      toast.success('ARC créé avec succès');
      // TODO: redirect to ARC.
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'ARC");
    },
  });

  const onArcButtonClick = () => {
    if (business.state !== BusinessState.DEVIS) {
      // TODO: redirect to ARC.
    }

    const detailsList = quotation.subQuotationList?.map((quote) => quote.quotationDetails ?? []) ?? [];
    if (!detailsList.some((details) => details.length > 0)) {
      toast.warning('Veuillez ajouter un produit le devis.');
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
      </div>
      <div className={styles.buttons_container}>
        {/* <Link to={`/app/businesses/business-study/${business.id}`} className="btn btn-secondary"> // TODO: reimplement this
          Accès à l&apos;étude
        </Link> */}
        <Link from={routeApi.id} to="commercial-notice" search={(old) => old} replace className="btn btn-primary">
          Générer les notices commerciales
        </Link>
        {/* {![BusinessState.FACTURE, BusinessState.ARC, BusinessState.BP, BusinessState.BL].includes(business.state!) ||
          (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && business.state === BusinessState.FACTURE && (
            <SaveQuotationButton business={business} quotation={quotation} handleSubmit={handleSubmit} /> // TODO: reimplement this
          ))} */}
        {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
          <button className="btn btn-secondary" disabled={isCreateArcPending} onClick={() => onArcButtonClick()}>
            {isCreateArcPending ? "Création de l'ARC..." : 'Passer en ARC'}
          </button>
        )}
      </div>
    </div>
  );
}
