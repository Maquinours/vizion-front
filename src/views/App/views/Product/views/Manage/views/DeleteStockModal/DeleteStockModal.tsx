import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteProductVersionShelfStock } from '../../../../../../../../utils/api/productVersionShelfStock';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteStockModal.module.scss';

const routeApi = getRouteApi('/app/products_/$productId/manage/delete-stock/$stockId');

export default function AppViewProductViewManageViewDeleteStockModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { stockId } = routeApi.useParams();

  const { data: stock } = useSuspenseQuery(queries['product-version-shelf-stocks'].detail._ctx.byId(stockId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProductVersionShelfStock(stock.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-version-shelf-stocks']._def });
      toast.success('Stock supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du stock');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.delete_modal} shouldCloseOnOverlayClick={!isPending} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> le stock du produit{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{stock.reference}</span> {"sur l'étagère "}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{stock.productVersionShelf?.number ?? ''}</span> ?
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le stock définitivement.</p>
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
