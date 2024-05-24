import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteProductSerialNumber } from '../../../../../../../../utils/api/productSerialNumber';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteModal.module.scss';

const routeApi = getRouteApi('/app/products/serial-numbers/delete/$serialNumberId');

export default function AppViewProductsViewSerialNumbersModalViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { serialNumberId } = routeApi.useParams();

  const { data: serialNumber } = useSuspenseQuery(queries['product-serial-numbers'].detail._ctx.byId(serialNumberId));

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProductSerialNumber(serialNumber.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-serial-numbers']._def });
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
