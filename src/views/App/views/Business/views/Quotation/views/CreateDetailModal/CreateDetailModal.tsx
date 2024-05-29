import ReactModal from 'react-modal';
import styles from './CreateDetailModal.module.scss';
import * as yup from 'yup';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { createBusinessQuotationDetail } from '../../../../../../../../utils/api/businessQuotationDetails';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/create-detail/$subquotationId');

const yupSchema = yup.object({
  product: yup.mixed<ProductResponseDto>().required('Le produit est requis.'),
  quantity: yup.number().typeError('Format invalide').min(1, 'AU moins un produit').required('Le nombre est requis.'),
});

export default function AppViewBusinessViewQuotationViewCreateDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, subquotationId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
  const { data: subQuotation } = useSuspenseQuery(queries['business-sub-quotations'].detail._ctx.byId(subquotationId));

  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) => {
      const unitPrice = data.product.publicPrice! - (data.product.publicPrice! * business.reduction!) / 100;
      const totalPrice = unitPrice * data.quantity;
      const totalAmountHT = quotation.totalAmountHT! + totalPrice;
      const shippingServicePrice = totalAmountHT < 1200 ? quotation.shippingServicePrice : 0;
      return createBusinessQuotationDetail({
        groupName: subQuotation!.name,
        subQuoteId: subQuotation!.id,
        quoteId: quotation.id,
        numDetails: business.numBusiness,
        productId: data.product.id,
        productReference: data.product.reference!,
        quantity: data.quantity,
        productDesignation: data.product.shortDescription,
        productDescription: data.product.description,
        productName: data.product.reference,
        reduction: business.reduction,
        publicUnitPrice: data.product.publicPrice!,
        unitPrice,
        totalPrice,
        taxDEEE: 0,
        totalAmountHT,
        totalAmount: (totalAmountHT + shippingServicePrice) * 1.2,
        shippingServicePrice,
        virtualQty: data.product.virtualQty,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      toast.success('Produit ajouté avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du produit");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un produit</h6>
        </div>
        <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
          <div className={styles.modal_content}>
            <div className={styles.form_group}>
              <label htmlFor="productReference">Nom du produit</label>
              <Controller
                render={({ field: { value, onChange } }) => (
                  <CustomSelect
                    placeholder="Sélectionnez un produit"
                    options={products}
                    isLoading={isLoadingProducts}
                    getOptionLabel={(option) => option.reference ?? ''}
                    getOptionValue={(option) => option.id}
                    value={value}
                    onChange={onChange}
                  />
                )}
                name="product"
                control={control}
              />
              <p className={styles.__errors}>{errors.product?.message}</p>
            </div>
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
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
