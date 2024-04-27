import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { createBusinessBp } from '../../../../../../../../../../utils/api/businessBps';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../../../../../utils/enums/BusinessState';
import BusinessBpDetailsRequestDto from '../../../../../../../../../../utils/types/BusinessBpDetailsRequestDto';
import styles from './SectionOne.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc');

export default function AppViewBusinessViewArcViewHeaderComponentSectionOneComponent() {
  const queryClient = useQueryClient();
  // const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const products = await queryClient.ensureQueryData(queries.product.list);

      const list =
        arc.arcDetailsList?.reduce((acc: Array<BusinessBpDetailsRequestDto>, el) => {
          const product = products.find((p) => p.reference === el.productReference);
          if (el.bom) {
            for (const detail of product?.productBOMDetails ?? []) {
              const detailProduct = products.find((p) => p.id === detail.product?.id);
              const detailVersion = detailProduct?.productVersions && detailProduct.productVersions.length === 1 ? detailProduct.productVersions[0] : null;
              acc.push({
                numDetails: arc.number,
                productReference: detail?.product?.reference,
                productId: detail?.product?.id,
                productVersionReference: detailVersion?.reference,
                productVersionId: detailVersion?.id,
                quantity: Number(el.quantity * (detail?.qte ?? 0)),
                quantityRemain: Number(el.quantity * (detail?.qte ?? 0)),
                quantityPrep: 0,
                productDesignation: detail?.product?.shortDescription,
                productDescription: detail?.product?.description,
                productName: detail?.product?.reference,
                publicUnitPrice: detail?.product?.publicPrice,
                comment: el.productReference,
                unitPrice: detail?.product?.publicPrice,
                totalPrice: Number(el.quantity * (detail?.qte ?? 0)) * (detail?.product?.publicPrice ?? 0),
                bpSerialList: [],
                virtualQty: detail?.product?.virtualQty,
              });
            }
          } else {
            const productVersion = Array.isArray(product?.productVersions) && product.productVersions.length === 1 ? product.productVersions[0] : null;
            acc.push({
              numDetails: el.numDetails,
              productReference: el.productReference,
              productId: el.productId,
              productVersionReference: productVersion?.reference,
              productVersionId: productVersion?.id,
              quantity: el.quantity,
              quantityRemain: el.quantity,
              quantityPrep: 0,
              productDesignation: el.productDesignation,
              productName: el.productName,
              publicUnitPrice: el.unitPrice,
              comment: null,
              unitPrice: el.unitPrice,
              totalPrice: el.totalPrice,
              bpSerialList: [],
              virtualQty: el.virtualQty,
            });
          }
          return acc;
        }, []) ?? [];

      if (list.length === 0) throw new Error('No details found');

      return createBusinessBp({
        number: arc.number,
        globalPrep: 0,
        vat: arc.vat,
        shippingServicePrice: (arc.totalAmountHT ?? 0) > 1200 ? 0 : 25,
        numOrder: arc.numOrder,
        businessId: businessId,
        bpDetailsList: list,
        totalAmountHT: arc.totalAmountHT,
        totalAmount: arc.totalAmount,
        bom: arc.bom,
      });
    },
    onSuccess: () => {
      //set query data
      toast.success('Le BP a été créé avec succès');
      // navigate to BP
    },
    onError: (error) => {
      if (error.message === 'No details found') toast.warning("Veuillez ajouter des détails à l'ARC avant de passer en BP");
      else {
        console.error(error);
        toast.error('Une erreur est survenue lors de la création du BP');
      }
    },
  });

  const onBpButtonClick = async () => {
    if (business.state !== BusinessState.ARC) {
      // TODO: redirect to BP
    }
    if (arc.numOrder) {
      toast.warning("Veuillez sauvegarder l'ARC avec un numéro de commande avant de passer en BP");
      return;
    }
    mutate();
  };

  return (
    <div className={styles.header}>
      <div className={styles.business_info}>
        <span>{business.enterpriseName}</span> / <span>{business.title}</span>
      </div>
      <div>
        <Link from={routeApi.id} to="pdf" search={(old) => old} className="btn btn-primary-light">
          Editer
        </Link>
        <button disabled={isPending} className="btn btn-secondary" onClick={() => onBpButtonClick()}>
          {isPending ? 'Création du BP...' : 'Passer en BP'}
        </button>
      </div>
    </div>
  );
}
