import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { productSerialNumberQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productSerialNumber';
import { getProductSerialNumberById } from '../../../../../../../../utils/api/productSerialNumber';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { createRmaFromBusiness } from '../../../../../../../../utils/api/rma';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';
import { toast } from 'react-toastify';
import React from 'react';
import styles from './CreateRmaModal.module.scss';

const routeApi = getRouteApi('/app/products/serial-numbers/create-rma/$serialNumberId');

export default function AppViewProductsViewSerialNumbersModalViewCreateRmaModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { serialNumberId } = routeApi.useParams();

  const { data: serialNumber } = useSuspenseQuery({
    queryKey: productSerialNumberQueryKeys.detailById(serialNumberId),
    queryFn: () => getProductSerialNumberById(serialNumberId),
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => createRmaFromBusiness(CategoryBusiness.AFFAIRE, serialNumber.businessNumber!, [serialNumber.serialNumber!]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSerialNumberQueryKeys.all });
      toast.success('Le RMA a été généré avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du RMA');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal
      isOpen={true}
      overlayClassName="Overlay"
      className={styles.modal}
      shouldCloseOnOverlayClick={!isPending}
      shouldCloseOnEsc={!isPending}
      onRequestClose={onClose}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>générer</span> un RMA pour le produit{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}> {serialNumber.productRef} </span> de numéro de série{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}> {serialNumber.serialNumber} </span> ?
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Générer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
