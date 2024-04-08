import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import ReactModal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteObjectOnS3 } from '../../utils/api/ged';
import { geds } from '../../utils/constants/queryKeys/ged';
import FileType from '../../utils/enums/FileType';
import { findRecursively } from '../../utils/functions/arrays';
import styles from './DeleteGedObjectModal.module.scss';

type DeleteGedObjectModalComponentProps = Readonly<{
  type: FileType;
  id: string;
  objectRelativePath: string;
  onClose: () => void;
}>;
export default function DeleteGedObjectModalComponent({ type, id, objectRelativePath, onClose }: DeleteGedObjectModalComponentProps) {
  const queryClient = useQueryClient();

  const { data: item } = useSuspenseQuery({
    ...geds.detail._ctx.byTypeAndId(type, id),
    select: (data) => findRecursively(data, 'subRows', (el) => el.relativePath === objectRelativePath),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteObjectOnS3(type, id, item!),
    onMutate: () => ({ item: item! }),
    onSuccess: (_data, _params, context) => {
      queryClient.invalidateQueries({ queryKey: geds.detail._ctx.byTypeAndId(type, id).queryKey });
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

  useEffect(() => {
    if (!item) {
      toast.error('Impossible de trouver le dossier ou le fichier à supprimer');
      onClose();
    }
  }, [item]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.delete_modal} overlayClassName="Overlay">
      {item && (
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
      )}
    </ReactModal>
  );
}
