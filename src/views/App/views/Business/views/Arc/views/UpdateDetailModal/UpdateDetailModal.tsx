import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { updateBusinessArcDetail } from '../../../../../../../../utils/api/businessArcDetails';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import styles from './UpdateDetailModal.module.scss';
import { useEffect } from 'react';
import { format } from 'date-fns';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc/update-detail/$detailId');

const yupSchema = yup.object({
  product: yup.mixed<ProductResponseDto>().required('La référence est requise.'),
  designation: yup.string().required('La description est requise.'),
  availability: yup.string().oneOf(['yes', 'no']).required('La disponibilité est requise.'),
  availabilityDate: yup
    .string()
    .nullable()
    .typeError('Format invalide')
    .when('productAvailablity', {
      is: false,
      then: () => yup.string().typeError('Format invalide').required('La disponibilité est requise.'),
    }),
  quantity: yup.number().typeError('Format invalide').required('Le nombre est requis.'),
  price: yup
    .number()
    .transform((_value, originalValue) => (typeof originalValue === 'string' ? Number(originalValue.replace(/,/, '.')) : originalValue))
    .typeError('Format invalide')
    .required('Le nombre est requis.'),
});

export default function AppViewBusinessViewArcViewUpdateDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, detailId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));
  const { data: detail } = useSuspenseQuery(queries['business-arc-details'].detail._ctx.byId(detailId));
  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const onChangeProduct = (product: ProductResponseDto | null) => {
    setValue('designation', product?.shortDescription ?? '');
    setValue('price', (product?.publicPrice ?? 0) * (1 - (business.reduction ?? 0) / 100));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) => {
      const reduction = (1 - data.price / detail!.publicUnitPrice) * 100;
      const totalPrice = data.quantity * data.price;
      const totalAmountHT = (arc.totalAmountHT ?? 0) - detail!.totalPrice + totalPrice;
      const shippingServicePrice = totalAmountHT < 1200 ? arc.shippingServicePrice : 0;
      const totalAmount = (totalAmountHT + shippingServicePrice) * 1.2;
      return updateBusinessArcDetail(detail!.id, {
        arcId: arc.id,
        numDetails: detail!.numDetails,
        productReference: data.product.reference,
        quantity: data.quantity,
        productDesignation: data.designation,
        productDescription: data.product.description,
        productName: data.product.reference,
        productId: data.product.id,
        publicUnitPrice: detail!.publicUnitPrice,
        stock: data.availability === 'yes',
        availableDate: data.availability === 'yes' ? null : data.availabilityDate,
        bom: detail!.bom,
        reduction,
        unitPrice: data.price,
        totalPrice,
        taxDEEE: 0,
        totalAmountHT,
        totalAmount,
        shippingServicePrice,
        virtualQty: data.product.virtualQty,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries['business-arc-details'].detail._ctx.byId(detailId).queryKey });
      queryClient.invalidateQueries({ queryKey: queries['business-ARCs'].detail._ctx.byBusinessId(businessId).queryKey });
      queryClient.setQueryData(queries['business-arc-details'].detail._ctx.byId(data.id).queryKey, data);
      toast.success('Détail mis à jour avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la mise à jour du détail');
    },
  });

  useEffect(() => {
    setValue('designation', detail.productDesignation);
    setValue('quantity', detail.quantity);
    setValue('price', detail.unitPrice);
    setValue('availability', detail.stock ? 'yes' : 'no');
    setValue('availabilityDate', detail.availableDate ? format(new Date(detail.availableDate), 'yyyy-MM-dd') : null);
  }, [detail.id]);

  useEffect(() => {
    const product = products?.find((p) => p.reference === detail.productReference);
    if (product) setValue('product', product);
  }, [isLoadingProducts]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Modifier le produit {detail.productReference}</h6>
        </div>
        <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
          <div className={styles.modal_content}>
            <div className={styles.form_group}>
              <label htmlFor="productReference">Référence</label>
              <Controller
                control={control}
                name="product"
                render={({ field: { value, onChange } }) => (
                  <CustomSelect
                    placeholder="Sélectionnez un produit"
                    options={products}
                    isLoading={isLoadingProducts}
                    getOptionLabel={(opt) => opt.reference ?? ''}
                    getOptionValue={(opt) => opt.id}
                    value={value}
                    onChange={(newValue, actionMeta) => {
                      onChange(newValue, actionMeta);
                      onChangeProduct(newValue);
                    }}
                  />
                )}
              />
              <p className={styles.__errors}>{errors.product?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productDesignation">Désignation</label>
              <input id="productDesignation" {...register('designation')} type="text" autoComplete="on" />
              <p className={styles.__errors}>{errors.designation?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productPrice">Prix tarifaire (€)</label>
              <Controller
                control={control}
                name="price"
                render={({ field: { value, onChange } }) => <CurrencyFormat value={value} onValueChange={(v) => onChange(v.value)} displayType="input" />}
              />
              <p className={styles.__errors}>{errors.price?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productAvailablity">Disponibilité</label>
              <select id="productAvailablity" {...register('availability')}>
                {[
                  { label: 'Oui', value: 'yes' },
                  { label: 'Non', value: 'no' },
                ].map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <p className={styles.__errors}>{errors.availability?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productAvailablityDate">Date de disponibilité</label>
              <input id="productAvailablityDate" {...register('availabilityDate')} type="date" />
              <p className={styles.__errors}>{errors.availabilityDate?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productQuantity">Quantité</label>
              <Controller
                control={control}
                name="quantity"
                render={({ field: { value, onChange } }) => (
                  <AmountFormat id="productQuantity" value={value} onChange={onChange} displayType="input" decimalScale={0} />
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
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
