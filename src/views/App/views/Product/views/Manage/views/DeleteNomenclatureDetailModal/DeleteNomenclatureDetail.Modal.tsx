import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import styles from './DeleteNomenclatureDetailModal.module.scss';
import { getRouteApi } from '@tanstack/react-router';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import React from 'react';
import { deleteProductNomenclatureDetail } from '../../../../../../../../utils/api/productNomenclatures';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/products/$productId/manage/delete-nomenclature-detail/$nomenclatureDetailId');

export default function AppViewProductViewManageViewDeleteNomenclatureDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { productId, nomenclatureDetailId } = routeApi.useParams();

  const { data: nomenclatureDetail } = useSuspenseQuery({
    ...queries.product.detail(productId),
    select: (data) => data.productBOMDetails?.find((bom) => bom.id === nomenclatureDetailId),
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProductNomenclatureDetail(nomenclatureDetail!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.product._def });
      toast.success('Le produit a été supprimé de la nomenclature avec succès');
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
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} shouldCloseOnOverlayClick={!isPending} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> le produit{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{nomenclatureDetail?.product?.reference}</span> de cette nomenclature ?
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le produit définitivement.</p>
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
