import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { productSerialNumberQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productSerialNumber';
import { deleteProductSerialNumber, getProductSerialNumberById } from '../../../../../../../../utils/api/productSerialNumber';
import { PulseLoader } from 'react-spinners';
import styles from './DeleteModal.module.scss';
import { toast } from 'react-toastify';
import React from 'react';

const routeApi = getRouteApi('/app/products/serial-numbers/delete/$serialNumberId');

export default function AppViewProductsViewSerialNumbersModalViewDeleteModalView() {
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
    mutationFn: () => deleteProductSerialNumber(serialNumber.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSerialNumberQueryKeys.all });
      toast.success('Le numero de serie a été supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du numero de serie');
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
          <h6>Suppression</h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.form_content}>
            <p>
              Vous êtes sur le point de supprimer le numero de serie <span className="text-primary">{serialNumber.serialNumber}</span> de la version{' '}
              <span className="text-secondary">{serialNumber.productVersionRef}</span> du produit{' '}
              <span className="text-secondary">{serialNumber.productRef}</span>.
            </p>
            <p>Voulez-vous continuer ?</p>
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
