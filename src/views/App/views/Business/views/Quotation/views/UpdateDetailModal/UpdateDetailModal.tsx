import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './UpdateDetailModal.module.scss';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateBusinessQuotationDetail } from '../../../../../../../../utils/api/businessQuotationDetails';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { useEffect } from 'react';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/update-detail/$detailId');

const yupSchema = yup.object({
  designation: yup.string().required('La désignation est requise'),
  publicPrice: yup.number().typeError('Format invalide').required('Le prix est requis.'),
  discount: yup.number().typeError('Format invalide').required('Le prix est requis.'),
  unitPrice: yup
    .number()
    .transform((_value, originalValue) => (typeof originalValue === 'string' ? Number(originalValue.replace(/,/, '.')) : originalValue))
    .typeError('Format invalide')
    .required('Le prix est requis.'),
  quantity: yup.number().typeError('Format invalide').required('La quantité est requise'),
});

export default function AppViewBusinessViewQuotationViewUpdateDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, detailId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
  const { data: detail } = useSuspenseQuery(queries['business-quotation-details'].detail._ctx.byId(detailId));

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) => {
      const totalPrice = data.unitPrice * data.quantity;
      const totalAmountHT = quotation.totalAmountHT! + totalPrice;
      const shippingServicePrice = totalAmountHT < 1200 ? quotation.shippingServicePrice : 0;

      return updateBusinessQuotationDetail(detail.id, {
        groupName: detail.groupName,
        subQuoteId: quotation.subQuotationList!.find((sub) => sub.quotationDetails?.some((d) => d.id === detail.id))!.id,
        quoteId: quotation.id,
        numDetails: detail.numDetails,
        productReference: detail.productReference,
        quantity: data.quantity,
        productDesignation: data.designation,
        productDescription: data.designation,
        productName: detail.productReference,
        reduction: data.discount,
        publicUnitPrice: data.publicPrice,
        unitPrice: data.unitPrice,
        bom: detail.bom,
        totalPrice,
        taxDEEE: 0,
        totalAmountHT,
        totalAmount: (totalAmountHT + shippingServicePrice) * 0.2,
        shippingServicePrice,
        virtualQty: detail.virtualQty,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      toast.success('Détail du devis modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du détail du devis');
    },
  });

  useEffect(() => {
    setValue('designation', detail.productDesignation);
    setValue('quantity', detail.quantity ?? 0);
    setValue('unitPrice', detail.unitPrice ?? 0);
    setValue('discount', detail.reduction ? detail.reduction : 0);
    setValue('publicPrice', detail.publicUnitPrice);
  }, [detail.id]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Modifier le produit {detail.productReference}</h6>
        </div>
        <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
          <div className={styles.modal_content}>
            {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <>
                <div className={styles.form_group}>
                  <label htmlFor="productDesignation">Désignation</label>
                  <input id="productDesignation" {...register('designation')} type="text" autoComplete="on" />
                  <p className={styles.__errors}>{errors.designation?.message}</p>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="productPublicPrice">Prix public (€)</label>
                  <input id="productPublicPrice" {...register('publicPrice')} type="number" />
                  <p className={styles.__errors}>{errors.publicPrice?.message}</p>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="productDiscount">Remise (%)</label>
                  <input id="productDiscount" max={100} {...register('discount')} type="number" />
                  <p className={styles.__errors}>{errors.discount?.message}</p>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="productPrice">Prix unitaire (€)</label>
                  <input id="productPrice" {...register('unitPrice')} type="number" />
                  <p className={styles.__errors}>{errors.unitPrice?.message}</p>
                </div>
              </>
            )}
            <div className={styles.form_group}>
              <label htmlFor="productQuantity">Quantité</label>
              <input id="productQuantity" {...register('quantity')} type="number" autoComplete="on" />
              <p className={styles.__errors}>{errors.quantity?.message}</p>
            </div>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
