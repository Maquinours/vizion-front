import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteAddress } from '../../../../../../../../../../utils/api/address';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/address-book/delete/$addressId');

export default function AppViewBusinessViewDashboardViewAddressBookModalViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { addressId } = routeApi.useParams();

  const { data: address } = useSuspenseQuery(queries.address.detail._ctx.byId(addressId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.address._def });
      toast.success("L'adresse a bien été supprimée");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur s'est produite lors de la suppression de l'adresse");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.new_address_book_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>{"Supprimer l'adresse"}</div>
        </div>

        <div className={styles.modal_body}>
          <form onSubmit={onSubmit} onReset={onClose}>
            <div>
              <p>
                {"Vous êtes sur le point de supprimer l'adresse de la société "}
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bolder' }}>{address.enterpriseName}</span> du client{' '}
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{address.fullName}</span>.
              </p>
              <p>Voulez-vous continuer ?</p>
            </div>
            {isPending && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '1rem 0',
                }}
              >
                <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
              </div>
            )}
            <div className={styles.footer_buttons}>
              <button className="btn btn-primary-light" type="reset">
                Annuler
              </button>
              <button className="btn btn-secondary" type="submit">
                Supprimer
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
