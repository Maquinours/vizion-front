import { useMutation } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteLifesheet } from '../../utils/api/lifesheet';
import LifeSheetResponseDto from '../../utils/types/LifeSheetResponseDto';
import styles from './DeleteLifesheetModal.module.scss';

type DeleteLifesheetModalComponentProps = Readonly<{
  lifesheet: LifeSheetResponseDto;
  onClose: () => void;
}>;
export function DeleteLifesheetModalComponent({ lifesheet, onClose }: DeleteLifesheetModalComponentProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteLifesheet(lifesheet),
    onSuccess: () => {
      toast.success('Commentaire supprimé de la fiche de vie avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du commentaire de la fiche de vie');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>supprimer</span> le commentaire de la fiche de
            vie ?
          </h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le numéro de série définitivement.</p>
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
