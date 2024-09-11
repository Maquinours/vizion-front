import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { updateProductNomenclatureDetail } from '../../../../../../../../utils/api/productNomenclatures';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateNomenclatureDetail.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/update-nomenclature-detail/$nomenclatureDetailId');

const yupSchema = yup.object().shape({
  quantity: yup
    .number()
    .typeError('Format invalide')
    .integer('La quantité doit être un nombre entier')
    .min(1, 'La quantité doit être supérieure à 1')
    .required('Le champs est requis'),
});

export default function AppViewProductViewManageViewUpdateNomenclatureDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { productId, nomenclatureDetailId } = routeApi.useParams();

  const {
    data: { product, nomenclatureDetail },
  } = useSuspenseQuery({
    ...queries.product.detail(productId),
    select: (data) => ({ product: data, nomenclatureDetail: data.productBOMDetails?.find((bom) => bom.id === nomenclatureDetailId) }),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: !!nomenclatureDetail?.qte
      ? {
          quantity: nomenclatureDetail.qte,
        }
      : undefined,
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      updateProductNomenclatureDetail(product.id, nomenclatureDetail!.id, {
        qte: data.quantity,
        productId: nomenclatureDetail!.product!.id,
        productRef: nomenclatureDetail!.product!.reference!,
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

  if (!nomenclatureDetail) return null;

  return (
    <ReactModal isOpen onRequestClose={onClose} overlayClassName="Overlay" className={styles.modal} shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Modification d&apos;un produit de la nomenclature</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productReference">
              Référence de produit :
            </label>
            <div className={styles.react_select_custom}>
              <CustomSelect
                id="productReference"
                value={nomenclatureDetail.product!}
                placeholder="Sélectionnez un produit"
                options={[nomenclatureDetail.product!]}
                getOptionLabel={(opt) => opt.reference ?? ''}
                getOptionValue={(opt) => opt.id}
                isDisabled
              />
            </div>
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
              {isPending ? 'Modification en cours...' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
