import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteProductSpecification } from '../../../../../../../../utils/api/productSpecification';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteSpecificationModal.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/delete-specification/$specificationId');

export default function AppViewProductViewManageViewDeleteSpecificationModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { productId, specificationId } = routeApi.useParams();

  const { data: product } = useSuspenseQuery(queries.product.detail._ctx.byId(productId));

  const { data: productSpec } = useSuspenseQuery(queries.product.detail._ctx.byId(productId)._ctx.specifications._ctx.detail._ctx.byId(specificationId));

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProductSpecification(productId, specificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.product._def });
      toast.success('La spécification a été supprimée avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression de la spécification.');
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
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> la spécification de produit{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{productSpec.specification?.name}</span> du produit{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{product.reference}</span>
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
