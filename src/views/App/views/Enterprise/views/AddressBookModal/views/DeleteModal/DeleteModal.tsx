import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { addressQueryKeys } from '../../../../../../../../utils/constants/queryKeys/address';
import { deleteAddress, getAddressById } from '../../../../../../../../utils/api/address';
import AddressResponseDto from '../../../../../../../../utils/types/AddressResponseDto';
import { toast } from 'react-toastify';
import styles from './DeleteModal.module.scss';
import React from 'react';

const Route = getRouteApi('/app/enterprises/$enterpriseId/address-book/delete/$addressId');

export default function AppViewEnterpriseViewAddressBookModalViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { addressId } = Route.useParams();

  const { data: address } = useSuspenseQuery({
    queryKey: addressQueryKeys.detailById(addressId),
    queryFn: () => getAddressById(addressId),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', params: ({ enterpriseId }) => ({ enterpriseId }), search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteAddress(address),
    onMutate: () => ({ address }),
    onSuccess: (_data, _params, { address }) => {
      queryClient.getQueriesData<AddressResponseDto>({ queryKey: addressQueryKeys.details() }).forEach(([key, data]) => {
        if (data?.id === address.id) queryClient.removeQueries({ queryKey: key, exact: true });
      });
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.pages() });
      onClose();
      toast.success('Adresse supprimée avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la suppression de l'adresse");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>{"Supprimer l'adresse"}</div>
        </div>

        <div className={styles.modal_body}>
          <form onSubmit={onSubmit} onReset={onClose}>
            <div>
              <p>
                {"Vous êtes sur le point de supprimer l'adresse de la société "}
                <span
                  style={{
                    color: 'var(--secondary-color)',
                    fontWeight: 'bolder',
                  }}
                >
                  {address.enterpriseName}
                </span>{' '}
                du client{' '}
                <span
                  style={{
                    color: 'var(--secondary-color)',
                    fontWeight: 'bold',
                  }}
                >
                  {address.fullName}
                </span>
                {/**/}.
              </p>
              <p>Voulez-vous continuer ?</p>
            </div>
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
