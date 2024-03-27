import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { productQueryKeys } from '../../../../../../../../utils/constants/queryKeys/product';
import { addAssociatedProduct, getNotAssociatedProducts } from '../../../../../../../../utils/api/product';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import styles from './AddAssociatedProductModal.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/add-associated-product');

const yupSchema = yup.object().shape({
  associatedProduct: yup.mixed<ProductResponseDto>().required('Veuillez sélectionner un produit'),
});

export default function AppViewProductViewManageViewAddAssociatedProductModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { productId } = routeApi.useParams();

  const { data: productOptions, isLoading: isLoadingOptions } = useQuery({
    queryKey: productQueryKeys.listNotAssociatedProducts(productId),
    queryFn: () => getNotAssociatedProducts(productId),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ associatedProduct }: yup.InferType<typeof yupSchema>) => addAssociatedProduct(productId, associatedProduct.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
      toast.success('Produit associé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erreur lors de l'association du produit");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un produit associé</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productId">
              Référence :
            </label>
            <div className={styles.react_select_custom}>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    options={productOptions}
                    isLoading={isLoadingOptions}
                    getOptionLabel={(opt) => opt.reference ?? ''}
                    getOptionValue={(opt) => opt.id}
                    placeholder="Sélectionnez un produit"
                    value={value}
                    onChange={onChange}
                  />
                )}
                name="associatedProduct"
                control={control}
              />
            </div>
            <p className="__errors">{errors.associatedProduct?.message}</p>
          </div>
          <div className={styles.loader}>
            <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" disabled={isPending} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
