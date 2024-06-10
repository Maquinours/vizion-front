import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './UpdateDetailModal.module.scss';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateBusinessQuotationDetail } from '../../../../../../../../utils/api/businessQuotationDetails';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { useEffect } from 'react';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';

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
    control,
    formState: { errors },
    setValue,
    getValues,
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
      const totalAmountHT = (quotation.totalAmountHT ?? 0) - (detail.totalPrice ?? 0) + totalPrice;
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
        totalAmount: (totalAmountHT + shippingServicePrice) * 1.2,
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

  const onPublicPriceDiscountChange = () => {
    const publicPrice = getValues('publicPrice') || 0;
    const discount = getValues('discount') || 0;
    const unitPrice = publicPrice - (publicPrice * discount) / 100;
    setValue('unitPrice', unitPrice);
  };

  const onUnitPriceChange = () => {
    const publicPrice = getValues('publicPrice') || 0;
    const unitPrice = getValues('unitPrice') || 0;
    const discount = ((publicPrice - unitPrice) / publicPrice) * 100;
    setValue('discount', discount);
  };

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
                  <Controller
                    control={control}
                    name="publicPrice"
                    render={({ field: { value, onChange } }) => (
                      <CurrencyFormat
                        value={value}
                        onValueChange={(v, infos) => {
                          onChange(v.value);
                          if (infos.source === 'event') onPublicPriceDiscountChange();
                        }}
                        id="productPublicPrice"
                        displayType="input"
                      />
                    )}
                  />
                  <p className={styles.__errors}>{errors.publicPrice?.message}</p>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="productDiscount">Remise (%)</label>
                  <Controller
                    control={control}
                    name="discount"
                    render={({ field: { value, onChange } }) => {
                      const MAX_VALUE = 100;
                      return (
                        <AmountFormat
                          value={value}
                          onValueChange={(v, infos) => {
                            onChange(v.value);
                            if (infos.source === 'event') onPublicPriceDiscountChange();
                          }}
                          id="productDiscount"
                          displayType="input"
                          decimalScale={0}
                          suffix="%"
                          isAllowed={({ floatValue }) => !floatValue || floatValue <= MAX_VALUE}
                          max={MAX_VALUE}
                        />
                      );
                    }}
                  />
                  <p className={styles.__errors}>{errors.discount?.message}</p>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="productPrice">Prix unitaire (€)</label>
                  <Controller
                    control={control}
                    name="unitPrice"
                    render={({ field: { value, onChange } }) => (
                      <CurrencyFormat
                        value={value}
                        onValueChange={(v, infos) => {
                          onChange(v.value);
                          if (infos.source === 'event') onUnitPriceChange();
                        }}
                        id="productPrice"
                        displayType="input"
                      />
                    )}
                  />
                  <p className={styles.__errors}>{errors.unitPrice?.message}</p>
                </div>
              </>
            )}
            <div className={styles.form_group}>
              <label htmlFor="productQuantity">Quantité</label>
              <Controller
                control={control}
                name="quantity"
                render={({ field: { value, onChange } }) => (
                  <AmountFormat value={value} onValueChange={(v) => onChange(v.value)} id="productQuantity" displayType="input" decimalScale={0} min={1} />
                )}
              />
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
