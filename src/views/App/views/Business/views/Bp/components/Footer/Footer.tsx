import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { createBusinessBl } from '../../../../../../../../utils/api/businessBls';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './Footer.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp');

export default function AppViewBusinessViewBpViewFooterComponent() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));

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
        addressLineOne: business.deliverAddressOne,
        addressLineTwo: business.deliverAddressTwo,
        fullName: business.deliverAddressName ?? '',
        zipCode: business.deliverAddressZipCode,
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
      // set query data and redirect
    },
    onError: (error) => {
      if (!isAxiosError(error) && error.message === 'NO PRODUCT') toast.warning('Aucun produit preparé');
      else {
        console.error(error);
        toast.error('Une erreur est survenue lors de la création du bon de livraison');
      }
    },
  });

  const onBlButtonClick = () => {
    if (!business.deliveryMode) {
      toast.warning('Veuillez renseigner le mode de livraison');
      navigate({ to: '../dashboard' });
    } else {
      mutate();
    }
  };

  return (
    <div className={styles.footer_container}>
      <span>Poids total : {bp.totalWeight}kg</span>
      {!business.archived && (
        <div className={styles.buttons_container}>
          {business.deliveryMode !== 'A disposition' && (
            <Link from={routeApi.id} to="travel-voucher" search={(old) => old} replace className="btn btn-primary">
              Editer BT
            </Link>
          )}
          <button className="btn btn-secondary" onClick={() => onBlButtonClick()}>
            {isPending ? 'Edition du BL...' : 'Editer BL'}
          </button>
        </div>
      )}
    </div>
  );
}
