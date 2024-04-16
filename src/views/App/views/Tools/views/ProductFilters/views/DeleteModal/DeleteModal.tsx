import ReactModal from 'react-modal';
import styles from './DeleteModal.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { PulseLoader } from 'react-spinners';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { deleteProductFilter } from '../../../../../../../../utils/api/productFilter';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import React from 'react';

const routeApi = getRouteApi('/app/tools/product-filters/delete/$productFilterId');

export default function AppViewToolsViewProductFiltersViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { productFilterId } = routeApi.useParams();

  const { data: productFilter } = useSuspenseQuery(queries['product-filter'].detail._ctx.byId(productFilterId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProductFilter(productFilter.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-filter']._def });
      toast.success('Filtre supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du filtre');
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
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)' }}>supprimer</span> le filtre{' '}
            <span style={{ color: 'var(--secondary-color)' }}>{productFilter.name}</span> ?
          </h6>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le filtre définitivement.</p>
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
