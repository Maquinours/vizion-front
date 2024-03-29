import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { faqQueryKeys } from '../../../../../../utils/constants/queryKeys/faq';
import { getFaqById, updateFaq } from '../../../../../../utils/api/faq';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import styles from './ArchiveModal.module.scss';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/faq/archive/$faqId');

export default function AppViewFaqViewArchiveModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { faqId } = routeApi.useParams();

  const { data: faq } = useSuspenseQuery({
    queryKey: faqQueryKeys.detailById(faqId),
    queryFn: () => getFaqById(faqId),
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateFaq(faq.id, { title: faq.title, description: faq.description, accessLevel: faq.accessLevel, archived: !faq.archived }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
      toast.success(`La FAQ a été ${data.archived ? 'archivée' : 'désarchivée'} avec succès.`);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'archivage de la FAQ.");
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
            Êtes-vous certain.e de vouloir{' '}
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{faq.archived ? 'désarchiver' : 'archiver'}</span> le FAQ ?
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action va {faq.archived ? 'désarchiver' : 'archiver'} la FAQ.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              {faq.archived ? 'Désarchiver' : 'Archiver'}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
