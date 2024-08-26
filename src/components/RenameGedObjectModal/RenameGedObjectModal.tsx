import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { renameObjectOnS3 } from '../../utils/api/ged';
import { geds } from '../../utils/constants/queryKeys/ged';
import FileType from '../../utils/enums/FileType';
import { findRecursively } from '../../utils/functions/arrays';
import styles from './RenameGedObjectModal.module.scss';

const yupSchema = yup.object({
  name: yup.string().required('Le nom du dossier est requis'),
});

type RenameGedObjectModalComponentProps = Readonly<{
  id: string;
  type: FileType;
  objectRelativePath: string;
  onClose: () => void;
}>;
export default function RenameGedObjectModalComponent({ id, type, objectRelativePath, onClose }: RenameGedObjectModalComponentProps) {
  const queryClient = useQueryClient();

  const { data: item } = useSuspenseQuery({
    ...geds.detail._ctx.byTypeAndId(type, id),
    select: (data) => findRecursively(data, 'subRows', (el) => el.relativePath === objectRelativePath),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: item?.name ?? '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name }: yup.InferType<typeof yupSchema>) => renameObjectOnS3(type, id, item!, name),
    onMutate: () => ({ item: item! }),
    onSuccess: (_data, _params, context) => {
      queryClient.invalidateQueries({ queryKey: geds.detail._ctx.byTypeAndId(type, id).queryKey });
      onClose();
      toast.success(`${context.item.dir ? 'Dossier' : 'Fichier'} renommé avec succès`);
    },
    onError: (error, _params, context) => {
      console.error(error);
      toast.error(`Une erreur est survenue lors du renommage du ${context?.item.dir ? 'dossier' : 'fichier'}`);
    },
  });

  useEffect(() => {
    if (!item) {
      toast.error('Impossible de trouver le dossier ou le fichier à renommer');
      onClose();
    }
  }, [item]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.directory_modal} overlayClassName="Overlay">
      {item && (
        <div className={styles.container}>
          <div className={styles.title}>
            <h6>Renommer le {item.dir ? 'dossier' : 'fichier'}</h6>
          </div>

          <div className={styles.form}>
            <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
              <div className={styles.form_container}>
                <div className={styles.form__group}>
                  <label className={styles.label} htmlFor="directoryName">
                    Nom du dossier :
                  </label>
                  <input type="text" placeholder="..." {...register('name')} id="directoryName" autoCorrect="true" autoComplete="on" />
                  <p className={styles.__errors}>{errors.name?.message}</p>
                </div>
                <div className={styles.loader}>
                  <ClipLoader color="#31385A" loading={isPending} size="18px" />
                </div>

                <div className={styles.form_buttons}>
                  <button className="btn btn-primary-light" type="reset">
                    Annuler
                  </button>
                  <button className="btn btn-secondary" type="submit">
                    Renommer
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
