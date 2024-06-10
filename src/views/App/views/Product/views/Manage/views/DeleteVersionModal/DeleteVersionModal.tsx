import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteProductVersion } from '../../../../../../../../utils/api/productVersion';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteVersionModal.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/delete-version/$versionId');

export default function AppViewProductViewManageViewDeleteVersionModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { versionId } = routeApi.useParams();

  const { data: version } = useSuspenseQuery(queries['product-versions'].detail._ctx.byId(versionId));

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProductVersion(versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.product._def });
      toast.success('La version a été supprimée avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression de la version.');
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} shouldCloseOnOverlayClick={!isPending} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> la version{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{version.reference}</span> du produit{' '}
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer la version définitivement.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
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
