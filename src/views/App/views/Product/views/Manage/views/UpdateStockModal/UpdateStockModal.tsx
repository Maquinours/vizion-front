import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { updateProductVersionShelfStockQuantity } from '../../../../../../../../utils/api/productVersionShelfStock';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateStockModal.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/update-stock/$stockId');

const yupSchema = yup.object({
  quantity: yup.number().typeError('Format invalide').min(0, 'Min 0').required('La quantité est requise.'),
});

export default function AppViewProductViewManageViewUpdateStockModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { stockId } = routeApi.useParams();

  const { data: stock } = useSuspenseQuery(queries['product-version-shelf-stocks'].detail._ctx.byId(stockId));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      quantity: stock.currentStock ?? 0,
    },
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ quantity }: yup.InferType<typeof yupSchema>) => updateProductVersionShelfStockQuantity(stockId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.product._def });
      toast.success('Stock modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du stock');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} shouldCloseOnOverlayClick={!isPending} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Modification du stock du produit <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{stock.reference}</span> {"sur l'étagère "}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{stock.productVersionShelf?.number ?? ''}</span>
          </h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productVersionId">
              Version de produit :
            </label>
            <div className={styles.react_select_custom}>
              <CustomSelect
                options={[{ label: stock.versionReference ?? '', value: stock.productVersionId ?? '' }]}
                value={{ label: stock.versionReference ?? '', value: stock.productVersionId ?? '' }}
                placeholder="Sélectionnez un produit"
                isDisabled={true}
              />
            </div>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productShelf">
              Etagère cible :
            </label>
            <div className={styles.react_select_custom}>
              <CustomSelect
                options={stock.productVersionShelf ? [stock.productVersionShelf] : []}
                getOptionLabel={(opt) => opt?.number ?? ''}
                getOptionValue={(opt) => opt?.id ?? ''}
                value={stock.productVersionShelf}
                placeholder="Sélectionnez une étagère"
                onChange={() => {}}
                isDisabled={true}
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
              Modifier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
