import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteFaq } from '../../../../../../utils/api/faq';
import { faqs } from '../../../../../../utils/constants/queryKeys/faq';
import styles from './DeleteModal.module.scss';

const routeApi = getRouteApi('/app/faq/delete/$faqId');

export default function AppViewFaqViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { faqId } = routeApi.useParams();

  const { data: faq } = useSuspenseQuery(faqs.detail._ctx.byId(faqId));

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteFaq(faq.id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: faqs.detail._ctx.byId(faqId).queryKey });
      queryClient.invalidateQueries({ queryKey: faqs._def });
      toast.success('La FAQ a été supprimée avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression de la FAQ.');
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
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> la FAQ {faq.title} ?
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer la FAQ définitivement.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={onClose}>
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
