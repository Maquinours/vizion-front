import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import styles from './CreateDirectoryModal.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDirectoryOnS3 } from '../../../../utils/api/ged';
import FileType from '../../../../utils/enums/FileType';
import { gedQueryKeys } from '../../../../utils/constants/queryKeys/ged';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import FileDataTreeResponseDto from '../../../../utils/types/FileDataTreeResponseDto';
import { fileFolderValidationRegex } from '../../../../utils/functions/regex';

const yupSchema = yup.object({
  name: yup
    .string()
    .required('Le nom du dossier est requis')
    .matches(fileFolderValidationRegex, 'Le nom du dossier ne peut contenir les caractères suivants : / \\ : * ? " < > |'),
});

type GedComponentCreateDirectoryModalComponentProps = Readonly<{
  id: string;
  type: FileType;
  directory: FileDataTreeResponseDto | undefined;
  onClose: () => void;
}>;
export default function GedComponentCreateDirectoryModalComponent({ id, type, directory, onClose }: GedComponentCreateDirectoryModalComponentProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name }: yup.InferType<typeof yupSchema>) => createDirectoryOnS3(type, id, `${directory?.relativePath}${name}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gedQueryKeys.all });
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
