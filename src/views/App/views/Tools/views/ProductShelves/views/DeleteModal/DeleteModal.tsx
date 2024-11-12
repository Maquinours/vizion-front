import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteProductShelf } from '../../../../../../../../utils/api/productShelf';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteModal.module.scss';

const routeApi = getRouteApi('/app/tools/product-shelves/delete/$productShelfId');

export default function AppViewToolsViewProductShelvesViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { productShelfId } = routeApi.useParams();

  const { data: productShelf } = useSuspenseQuery(queries['product-shelves'].detail._ctx.byId(productShelfId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProductShelf(productShelf.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-shelves']._def });
      toast.success('Étagère supprimée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la suppression de l'étagère");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)' }}>supprimer</span> l&apos;étagère{' '}
            <span style={{ color: 'var(--secondary-color)' }}>{productShelf.number}</span> ?
          </h6>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>{"Cette action irréversible va supprimer l'étagère définitivement."}</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
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
