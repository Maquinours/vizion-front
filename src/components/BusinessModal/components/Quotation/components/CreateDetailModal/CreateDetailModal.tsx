import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createBusinessQuotationDetail } from '../../../../../../utils/api/businessQuotationDetails';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessQuotationResponseDto from '../../../../../../utils/types/BusinessQuotationResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import BusinessSubQuotationResponseDto from '../../../../../../utils/types/BusinessSubQuotationResponseDto';
import ProductResponseDto from '../../../../../../utils/types/ProductResponseDto';
import CustomSelect from '../../../../../CustomSelect/CustomSelect';
import styles from './CreateDetailModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation/create-detail/$subquotationId');

const yupSchema = yup.object({
  product: yup.mixed<ProductResponseDto>().required('Le produit est requis.'),
  quantity: yup.number().typeError('Format invalide').min(1, 'AU moins un produit').required('Le nombre est requis.'),
});

type BusinessModalComponentQuotationComponentCreateDetailModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  quotation: BusinessQuotationResponseDto;
  subQuotation: BusinessSubQuotationResponseDto;
  onClose: () => void;
}>;
export default function BusinessModalComponentQuotationComponentCreateDetailModalComponent({
  business,
  quotation,
  subQuotation,
  onClose,
}: BusinessModalComponentQuotationComponentCreateDetailModalComponentProps) {
  const queryClient = useQueryClient();
  //   const navigate = routeApi.useNavigate();

  //   const { businessId, subquotationId } = routeApi.useParams();

  //   const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  //   const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
  //   const { data: subQuotation } = useSuspenseQuery(queries['business-sub-quotations'].detail._ctx.byId(subquotationId));

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

  //   const onClose = () => {
  //     navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  //   };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) => {
      const unitPrice = data.product.publicPrice! - (data.product.publicPrice! * business.reduction!) / 100;
      const totalPrice = unitPrice * data.quantity;
      const totalAmountHT =
        (quotation.subQuotationList?.flatMap((subQuotation) => subQuotation.quotationDetails).reduce((acc, detail) => acc + (detail?.totalPrice ?? 0), 0) ??
          0) + totalPrice;
      const shippingServicePrice = totalAmountHT < 1200 ? quotation.shippingServicePrice : 0;
      const total = totalAmountHT + shippingServicePrice;
      const vat = business.exportTva ? total * 0.2 : 0;
      const totalAmount = total + vat;
      return createBusinessQuotationDetail({
        groupName: subQuotation.name,
        subQuoteId: subQuotation.id,
        quoteId: quotation.id,
        numDetails: business.numBusiness,
        productId: data.product.id,
        productReference: data.product.reference!,
        quantity: data.quantity,
        productDesignation: data.product.shortDescription,
        productDescription: data.product.description,
        productName: data.product.reference,
        reduction: business.reduction,
        publicUnitPrice: data.product.publicPrice ?? 0,
        unitPrice,
        totalPrice,
        taxDEEE: 0,
        totalAmountHT,
        totalAmount,
        shippingServicePrice,
        vat,
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
