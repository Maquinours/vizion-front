import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createBusinessBpDetail } from '../../../../../../../../../../utils/api/businessBpDetails';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import BusinessBpResponseDto from '../../../../../../../../../../utils/types/BusinessBpResponseDto';
import BusinessResponseDto from '../../../../../../../../../../utils/types/BusinessResponseDto';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import CustomSelect from '../../../../../../../../../CustomSelect/CustomSelect';
import styles from './AddDetailSection.module.scss';
// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp');

const yupSchema = yup.object({
  product: yup.mixed<ProductResponseDto>().required('Produit requis'),
  quantity: yup.number().integer('La quantité doit être un nombre entier').typeError('Invalide').required('Quantité requise'),
});

type BusinessModalComponentBpComponentHeaderComponentSectionTwoComponentAddDetailSectionComponentProps = Readonly<{
  business: BusinessResponseDto;
  bp: BusinessBpResponseDto;
}>;
export default function BusinessModalComponentBpComponentHeaderComponentSectionTwoComponentAddDetailSectionComponent({
  business,
  bp,
}: BusinessModalComponentBpComponentHeaderComponentSectionTwoComponentAddDetailSectionComponentProps) {
  const queryClient = useQueryClient();
  // const { businessId } = routeApi.useParams();

  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);
  // const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));

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
    mutationFn: ({ product, quantity }: yup.InferType<typeof yupSchema>) =>
      createBusinessBpDetail({
        bpId: bp.id,
        numDetails: null,
        productId: product.id,
        productVersionId: null,
        productName: product.reference,
        productVersionReference: null,
        quantity,
        quantityRemain: 0,
        quantityPrep: 0,
        productDesignation: product.shortDescription,
        productDescription: product.shortDescription,
        packageNumber: null,
        virtualQty: product.virtualQty,
        productReference: product.reference,
        publicUnitPrice: product.publicPrice,
        comment: null,
        unitPrice: product.publicPrice,
        bpSerialList: [],
      }),
    onSuccess: (data) => {
      queryClient.setQueryData<BusinessBpResponseDto>(queries['business-bps'].detail._ctx.byBusinessId(business.id).queryKey, (old) =>
        old ? { ...old, bpDetailsList: [...old.bpDetailsList, data] } : old,
      );
      queryClient.invalidateQueries({ queryKey: queries['business-bps']._def });
      toast.success('Détail ajouté avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du détail");
    },
  });

  return (
    <div className={styles.product_reference}>
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
        <div className={styles.button_container}>
          <button disabled={isPending} type="submit" className="btn btn-primary">
            Valider
          </button>
        </div>
      </form>
    </div>
  );
}
