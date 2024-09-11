import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { addProductNomenclatureDetail } from '../../../../../../../../utils/api/productNomenclatures';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import styles from './AddNomenclatureDetailModal.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/add-nomenclature-detail');

const yupSchema = yup.object().shape({
  product: yup.mixed<ProductResponseDto>().nonNullable().required('Le produit est requis'),
  quantity: yup
    .number()
    .typeError('Format invalide')
    .integer('La quantité doit être un nombre entier')
    .min(1, 'La quantité doit être supérieure à 1')
    .required('Le champs est requis'),
});

export default function AppViewProductViewManageViewAddNomenclatureDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { productId } = routeApi.useParams();

  const { data: product } = useSuspenseQuery(queries.product.detail(productId));

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    ...queries.product.list,
    select: (data) =>
      data.filter(
        (prod) => ![product.id, ...(product.productBOMDetails?.map((bom) => bom.product?.id) ?? [])].filter((id): id is string => !!id).includes(prod.id),
      ),
  });

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      addProductNomenclatureDetail(product.id, {
        qte: data.quantity,
        productId: data.product.id,
        productRef: data.product.reference!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.product._def });
      toast.success('Le produit a été ajouté à la nomenclature avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du produit");
    },
  });

  return (
    <ReactModal isOpen onRequestClose={onClose} overlayClassName="Overlay" className={styles.modal} shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajout d&apos;un produit dans la nomenclature</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productReference">
              Référence de produit :
            </label>
            <div className={styles.react_select_custom}>
              <Controller
                control={control}
                name="product"
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    id="productReference"
                    value={value}
                    placeholder="Sélectionnez un produit"
                    options={products}
                    getOptionLabel={(opt) => opt.reference ?? ''}
                    getOptionValue={(opt) => opt.id}
                    onChange={onChange}
                    isLoading={isLoadingProducts}
                  />
                )}
              />
            </div>
            <p className={styles.__errors}>{errors.product?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productQuantity">
              Quantité :
            </label>
            <input id="productQuantity" placeholder="..." type="number" {...register('quantity')} />
            <p className={styles.__errors}>{errors.quantity?.message}</p>
          </div>
          <div className={styles.loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" disabled={isPending} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              {isPending ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
