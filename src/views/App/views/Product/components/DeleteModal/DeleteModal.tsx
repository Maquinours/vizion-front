import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteProduct } from '../../../../../../utils/api/product';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './DeleteModal.module.scss';
const routeApi = getRouteApi('/app/products/$productId');

export default function AppViewProductViewDeleteModalComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { productId } = routeApi.useParams();

  const { data: product } = useSuspenseQuery(queries.product.detail(productId));

  const onClose = () => {
    navigate({ search: (old) => ({ ...old, productModal: undefined }), replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.product._def });
      toast.success('Produit supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du produit');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={onClose}
      className={styles.delete_modal}
      overlayClassName="Overlay"
      shouldCloseOnEsc={!isPending}
      shouldCloseOnOverlayClick={!isPending}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> le produit {product.reference} ?
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le produit définitivement.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
