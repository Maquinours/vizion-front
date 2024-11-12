import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../../../components/CustomSelect/CustomSelect';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import styles from './SectionThree.module.scss';
import { getRouteApi } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { createBusinessArcDetail } from '../../../../../../../../../../utils/api/businessArcDetails';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc');

const yupSchema = yup.object({
  product: yup.mixed<ProductResponseDto>().required('Le produit est requis'),
  quantity: yup.number().required('La quantité est requise'),
});

export default function AppViewBusinessViewArcViewHeaderComponentSectionThreeComponent() {
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));
  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

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

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ product, quantity }: yup.InferType<typeof yupSchema>) => {
      const unitPrice = (product.publicPrice ?? 0) * (1 - (business.reduction ?? 0) / 100);
      const totalPrice = unitPrice * quantity;
      const totalAmountHT = (arc.arcDetailsList?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0) ?? 0) + totalPrice;
      const shippingServicePrice = arc.shippingServicePrice === 25 && (arc.totalAmountHT ?? 0) < 1200 && totalAmountHT >= 1200 ? 0 : arc.shippingServicePrice;
      const vat = (totalAmountHT + shippingServicePrice) * 0.2;
      const totalAmount = totalAmountHT + shippingServicePrice + vat;

      return createBusinessArcDetail({
        arcId: arc.id,
        numDetails: arc.number,
        productId: product.id,
        productReference: product.reference,
        quantity: quantity,
        productDesignation: product.shortDescription,
        productDescription: product.description,
        productName: product.reference,
        reduction: business.reduction,
        publicUnitPrice: product.publicPrice,
        stock:
          product.virtualQty ||
          product.bom ||
          ((await queryClient.ensureQueryData(queries['product-stocks'].detail._ctx.byProductReference(product.reference!)))?.currentStock ?? 0) > 0,
        unitPrice,
        totalPrice,
        taxDEEE: 0,
        totalAmountHT,
        totalAmount: totalAmount,
        shippingServicePrice,
        virtualQty: product.virtualQty,
        bom: product.bom,
        vat,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-ARCs']._def });
      toast.success('Détail ajouté avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du détail");
    },
  });

  return (
    <div className={styles._one}>
      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <div className={styles.form_group}>
          <label htmlFor="productReference">Référence</label>
          <Controller
            control={control}
            name="product"
            render={({ field: { value, onChange } }) => (
              <CustomSelect
                options={products}
                placeholder="Sélectionnez un produit"
                isLoading={isLoadingProducts}
                getOptionLabel={(opt) => opt.reference ?? ''}
                getOptionValue={(opt) => opt.id}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <p className={styles.__errors}>{errors.product?.message}</p>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="productQuantity">Quantité</label>
          <input id="productQuantity" type="number" {...register('quantity')} />
          <p className={styles.__errors}>{errors.quantity?.message}</p>
        </div>
        <div>
          <button className="btn btn-primary" type="submit" disabled={isPending}>
            Valider
          </button>
        </div>
      </form>
    </div>
  );
}
