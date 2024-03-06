import ReactModal from 'react-modal';
import FileDataTreeResponseDto from '../../../../utils/types/FileDataTreeResponseDto';
import { ClipLoader } from 'react-spinners';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteObjectOnS3 } from '../../../../utils/api/ged';
import FileType from '../../../../utils/enums/FileType';
import { gedQueryKeys } from '../../../../utils/constants/queryKeys/ged';
import { toast } from 'react-toastify';
import styles from './DeleteModal.module.scss';

type GedComponentDeleteModalComponentProps = Readonly<{
  type: FileType;
  id: string;
  item: FileDataTreeResponseDto;
  onClose: () => void;
}>;
export default function GedComponentDeleteModalComponent({ type, id, item, onClose }: GedComponentDeleteModalComponentProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteObjectOnS3(type, id, item),
    onMutate: () => ({ item }),
    onSuccess: (_data, _params, context) => {
      queryClient.invalidateQueries({ queryKey: gedQueryKeys.all });
      onClose();
      toast.success(`${context.item.dir ? 'dossier' : 'fichier'} supprimé avec succès`);
    },
    onError: (error, _params, context) => {
      console.error(error);
      toast.error(`Une erreur est survenue lors de la suppression du ${context?.item.dir ? 'dossier' : 'fichier'}`);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.delete_modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>Suppression de {item.dir ? 'dossier' : 'fichier'}</h6>
        </div>

        <div className={styles.form}>
          <form onSubmit={onSubmit} onReset={onClose}>
            <div className={styles.form_container}>
              <div className={styles.form_content}>
                <p>
                  Voulez-vous supprimer le {item.dir ? 'dossier' : 'fichier'} de nom <span>{item.name}</span>
                </p>
                <p>Cette action est irréversible.</p>
              </div>
              <div className={styles.loader}>
                <ClipLoader color="#31385A" loading={isPending} size="18px" />
              </div>

              <div className={styles.form_buttons}>
                <button className="btn btn-primary-light" type="reset">
                  Annuler
                </button>
                <button className="btn btn-secondary" type="submit">
                  Supprimer
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
