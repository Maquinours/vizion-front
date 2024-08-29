import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { disassociateAllBusiness } from '../../utils/api/allBusiness';
import { queries } from '../../utils/constants/queryKeys';
import CategoryBusiness from '../../utils/enums/CategoryBusiness';
import styles from './DeleteBusinessRmaLinkModal.module.scss';

type DeleteBusinessRmaLinkModalComponentProps = Readonly<{
  category: CategoryBusiness;
  number: string;
  associatedId: string;
  onClose: () => void;
}>;
export default function DeleteBusinessRmaLinkModalComponent({ category, number, associatedId, onClose }: DeleteBusinessRmaLinkModalComponentProps) {
  const queryClient = useQueryClient();

  const { data: associated } = useSuspenseQuery(queries['all-businesses'].detail._ctx.byId(associatedId));

  const { mutate, isPending } = useMutation({
    mutationFn: () => disassociateAllBusiness({ category: category, number: number }, { category: associated.category, number: associated.number }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['all-businesses']._def });
      toast.success('Les affaires ont bien été dissociées');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la dissociation de l'affaire");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
      {associated && (
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Supprimer la liaison</h6>
          </div>

          <div className={styles.modal_content}>
            <form onSubmit={onSubmit} onReset={onClose}>
              <div>
                <p>
                  Vous êtes sur le point de supprimer la liaison{' '}
                  <span style={{ color: 'var(--secondary-color)', fontWeight: 'bolder' }}>{associated.title}</span>
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
      )}
    </ReactModal>
  );
}
