import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { productSpecificationQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productSpecification';
import { deleteProductSpecification, getProductSpecificationById } from '../../../../../../../../utils/api/productSpecification';
import { productQueryKeys } from '../../../../../../../../utils/constants/queryKeys/product';
import { getProductById } from '../../../../../../../../utils/api/product';
import { toast } from 'react-toastify';
import React from 'react';
import styles from './DeleteSpecificationModal.module.scss';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/products/$productId/manage/delete-specification/$specificationId');

export default function AppViewProductViewManageViewDeleteSpecificationModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { productId, specificationId } = routeApi.useParams();

  const { data: product } = useSuspenseQuery({
    queryKey: productQueryKeys.detailById(productId),
    queryFn: () => getProductById(productId),
  });

  const { data: productSpec } = useSuspenseQuery({
    queryKey: productSpecificationQueryKeys.detailById(productId, specificationId),
    queryFn: () => getProductSpecificationById(productId, specificationId),
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProductSpecification(productId, specificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSpecificationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
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