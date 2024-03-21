import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { profileQueryKeys } from '../../utils/constants/queryKeys/profile';
import { deleteProfile, getProfileById } from '../../utils/api/profile';
import { toast } from 'react-toastify';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import styles from './DeleteContactModal.module.scss';

type DeleteContactModalComponentProps = Readonly<{
  contactId: string;
  onClose: () => void;
}>;
export default function DeleteContactModalComponent({ contactId, onClose }: DeleteContactModalComponentProps) {
  const queryClient = useQueryClient();

  const { data: contact } = useSuspenseQuery({
    queryKey: profileQueryKeys.detailById(contactId),
    queryFn: () => getProfileById(contactId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProfile(contact),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: profileQueryKeys.detailById(contactId), exact: true });
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      toast.success('Le contact a été supprimé avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du contact');
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
          <h6>Suppression de contact</h6>
        </div>

        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>
              {' '}
              Vous êtes sur le point de supprimer le profil de {contact.civility} {contact.lastName} {contact.firstName}, profil de type {contact.profileClient}{' '}
              .
            </p>
            <p>Voulez-vous continuer ?</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
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
