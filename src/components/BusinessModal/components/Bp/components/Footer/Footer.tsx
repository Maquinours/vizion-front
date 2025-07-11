import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { createBusinessBl } from '../../../../../../utils/api/businessBls';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessBpResponseDto from '../../../../../../utils/types/BusinessBpResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import AmountFormat from '../../../../../AmountFormat/AmountFormat';
import styles from './Footer.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp');
// const routePath = '/app/businesses-rma/business/$businessId/bp';

type BusinessModalComponentBpComponentFooterComponentProps = Readonly<{
  business: BusinessResponseDto;
  bp: BusinessBpResponseDto;
  onTravelVoucherClick: () => void;
}>;
export default function BusinessModalComponentBpComponentFooterComponent({
  business,
  bp,
  onTravelVoucherClick,
}: BusinessModalComponentBpComponentFooterComponentProps) {
  const queryClient = useQueryClient();
  // const navigate = routeApi.useNavigate();

  // const { businessId } = routeApi.useParams();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  // const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const filteredBlDetailsList = bp.bom
        ? bp.bpDetailsList
        : bp.bpDetailsList.filter((element) => {
            return (
              ((element.quantityPrep ?? 0) > 0 &&
                (element.quantityPrep ?? 0) <= (element.quantity ?? 0) &&
                element.quantityPrep !== element.quantityDelivered) ||
              element.virtualQty
            );
          });
      if (filteredBlDetailsList.length === 0) throw new Error('NO PRODUCT');

      return createBusinessBl({
        number: business.numBusiness,
        numBusiness: business.numBusiness,
        valid: true,
        agence: business.deliverAddressCompany,
        deliverMode: business.deliveryMode,
        numberOfPackage: 1,
        weight: 0,
        addressLineOne: business.deliverAddressOne ?? '',
        addressLineTwo: business.deliverAddressTwo,
        fullName: business.deliverAddressName ?? '',
        zipCode: business.deliverAddressZipCode ?? '',
        email: business.deliverEmail,
        phoneNumber: business.deliverPhoneNumber,
        enterpriseId: business.enterpriseId,
        businessId: business.id,
        enterpriseName: business.enterpriseName,
        blDetailsList: filteredBlDetailsList.map((element) => ({
          numDetails: business.numBusiness,
          numBusiness: business.numBusiness,
          productId: element.productId,
          productVersionId: (element.bpSerialList ?? []).length > 0 ? element.bpSerialList![0].productVersionId : null,
          bpDetailId: element.id,
          productReference: element.productReference,
          productVersionReference: element.productVersionReference,
          quantityDelivered: (element.quantityDelivered ?? 0) > 0 ? Number(element.quantityPrep) - Number(element.quantityDelivered) : element.quantityPrep,
          quantityOrdered: element.quantity,
          productDesignation: element.productDesignation,
          productDescription: element.productDescription,
          productName: element.productName,
          publicUnitPrice: element.publicUnitPrice,
          unitPrice: element.unitPrice,
          comment: element.comment,
          packageNumber: element.packageNumber,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-bls'].list._ctx.byBusinessId(business.id).queryKey });
      toast.success('Bon de livraison créé avec succès');
      // navigate({ to: '../bl', replace: true }); // TODO: go to bl modal
    },
    onError: (error) => {
      if (!isAxiosError(error) && error.message === 'NO PRODUCT') toast.warning('Aucun produit préparé');
      else {
        console.error(error);
        toast.error('Une erreur est survenue lors de la création du bon de livraison');
      }
    },
  });

  const onBlButtonClick = () => {
    // if (business.state !== BusinessState.BP) navigate({ to: '../bl', replace: true });
    if (!business.deliveryMode) {
      toast.warning('Veuillez renseigner le mode de livraison');
      // navigate({ to: '../dashboard', replace: true }); // TODO: go to dashboard modal
    } else mutate();
  };

  return (
    <div className={styles.footer_container}>
      <AmountFormat value={bp.totalWeight} prefix="Poids total : " suffix="kg" className="font-bold" decimalScale={2} />
      {!business.archived && (
        <div className={styles.buttons_container}>
          <button className="btn btn-primary" onClick={onTravelVoucherClick}>
            Éditer BT
          </button>
          {/* {business.deliveryMode !== 'A disposition' && (
            <Link from={routePath} to="travel-voucher" search replace resetScroll={false} preload="intent" className="btn btn-primary">
              Éditer BT
            </Link>
          )} */}
          <button disabled={isPending} className="btn btn-secondary" onClick={() => onBlButtonClick()}>
            {isPending ? 'Édition du BL...' : 'Éditer BL'}
          </button>
        </div>
      )}
    </div>
  );
}
