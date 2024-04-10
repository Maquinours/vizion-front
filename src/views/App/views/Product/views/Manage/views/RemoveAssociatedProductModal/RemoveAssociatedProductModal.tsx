import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { removeAssociatedProduct } from '../../../../../../../../utils/api/product';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './RemoveAssociatedProductModal.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/remove-associated-product/$associatedProductId');

export default function AppViewProductViewManageViewRemoveAssociatedProductModal() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { productId, associatedProductId } = routeApi.useParams();

  const { data: associatedProduct } = useSuspenseQuery(queries.product.detail(associatedProductId));

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => removeAssociatedProduct(productId, associatedProduct.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.product._def });
      toast.success('Produit associé supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erreur lors de la suppression du produit associé');
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> le produit associé{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{associatedProduct.reference}</span> ?
          </h6>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le produit associé définitivement.</p>
          </div>
          <div className={styles.loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" disabled={isPending} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
