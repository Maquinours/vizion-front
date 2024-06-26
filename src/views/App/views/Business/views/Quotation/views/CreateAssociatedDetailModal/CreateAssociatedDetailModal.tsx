import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './CreateAssociatedDetailModal.module.scss';
import * as yup from 'yup';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { createBusinessQuotationDetail } from '../../../../../../../../utils/api/businessQuotationDetails';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/create-associated-detail/$detailId');

const yupSchema = yup.object({
  product: yup.mixed<ProductResponseDto>().required('La référence est requise.'),
  quantity: yup.number().typeError('Format invalide').min(1, 'AU moins un produit').required('Le nombre est requis.'),
});

export default function AppViewBusinessViewQuotationViewCreateAssociatedDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, detailId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
  const { data: detail } = useSuspenseQuery(queries['business-quotation-details'].detail._ctx.byId(detailId));

  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list._ctx.byAssociatedProductId(detail.productId!));

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) => {
      const unitPrice = data.product.publicPrice! - (data.product.publicPrice! * business.reduction!) / 100;
      const totalPrice = unitPrice * data.quantity;
      const totalAmountHT = quotation.totalAmountHT! + totalPrice;
      const shippingServicePrice = totalAmountHT < 1200 ? quotation!.shippingServicePrice : 0;

      return createBusinessQuotationDetail({
        groupName: detail.groupName,
        subQuoteId: quotation.subQuotationList!.find((sub) => sub.quotationDetails?.some((d) => d.id === detail.id))!.id,
        quoteId: quotation.id,
        numDetails: detail.numDetails,
        productId: data.product.id,
        productReference: data.product.reference ?? '',
        quantity: data.quantity,
        productDesignation: data.product.shortDescription,
        productDescription: data.product.description,
        productName: data.product.reference,
        reduction: detail.reduction,
        publicUnitPrice: data.product.publicPrice ?? 0,
        unitPrice,
        totalPrice,
        taxDEEE: 0,
        totalAmountHT,
        totalAmount: (totalAmountHT + shippingServicePrice) * 0.2,
        shippingServicePrice,
        virtualQty: data.product.virtualQty,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      toast.success('Détail ajouté avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du détail");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un accessoire</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
            <div className={styles.form_group}>
              <p>Référence de l&apos;accessoire</p>
              <Controller
                control={control}
                name="product"
                render={({ field: { value, onChange } }) => (
                  <CustomSelect
                    value={value}
                    onChange={onChange}
                    options={products}
                    isLoading={isLoadingProducts}
                    getOptionLabel={(option) => option.reference ?? ''}
                    getOptionValue={(option) => option.id}
                  />
                )}
              />
              <p className={styles.__errors}>{errors.product?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productQuantity">Quantité</label>
              <input id="productQuantity" {...register('quantity')} type="number" />
              <p className={styles.__errors}>{errors.quantity?.message}</p>
            </div>
          </form>
        </div>

        <div className={styles.modal_loader}>
          <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
        </div>

        <div className={styles.modal_buttons}>
          <button className="btn btn-primary-light">Annuler</button>
          <button className="btn btn-secondary">Ajouter</button>
        </div>
      </div>
    </ReactModal>
  );
}
