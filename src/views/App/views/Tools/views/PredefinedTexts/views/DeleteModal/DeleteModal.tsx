import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { router } from '../../../../../../../../router';
import { deletePredefinedText } from '../../../../../../../../utils/api/predefinedText';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteModal.module.scss';

const routeApi = getRouteApi('/app/tools/predefined-texts/delete/$predefinedTextId');

export default function AppViewToolsViewPredefinedTextsViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { predefinedTextId } = routeApi.useParams();

  const { data: text } = useSuspenseQuery(queries['predefined-text'].detail(predefinedTextId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deletePredefinedText(text.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['predefined-text']._def });
      router.invalidate();
      toast.success('Texte prédéfini supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du texte prédéfini');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.delete_contact_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)' }}>supprimer</span> le texte prédéfini{' '}
            <span style={{ color: 'var(--secondary-color)' }}>{text.title}</span> ?
          </h6>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le document définitivement.</p>
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
