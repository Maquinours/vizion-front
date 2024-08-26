import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createDirectoryOnS3 } from '../../utils/api/ged';
import { geds } from '../../utils/constants/queryKeys/ged';
import FileType from '../../utils/enums/FileType';
import styles from './CreateGedDirectoryModal.module.scss';

const yupSchema = yup.object({
  name: yup.string().required('Le nom du dossier est requis'),
});

type CreateGedDirectoryModalComponentProps = Readonly<{
  id: string;
  type: FileType;
  directoryRelativePath: string;
  onClose: () => void;
}>;
export default function CreateGedDirectoryModalComponent({ id, type, directoryRelativePath, onClose }: CreateGedDirectoryModalComponentProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name }: yup.InferType<typeof yupSchema>) => createDirectoryOnS3(type, id, `${directoryRelativePath}${name}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: geds.detail._ctx.byTypeAndId(type, id).queryKey });
      onClose();
      toast.success(`Dossier créé avec succès`);
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Une erreur est survenue lors de la création du dossier`);
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.directory_modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>Nouveau dossier</h6>
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
                  Enregister
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
