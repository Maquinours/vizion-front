import * as yup from 'yup';
import { fileFolderValidationRegex } from '../../../../utils/functions/regex';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FileType from '../../../../utils/enums/FileType';
import FileDataTreeResponseDto from '../../../../utils/types/FileDataTreeResponseDto';
import ReactModal from 'react-modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renameObjectOnS3 } from '../../../../utils/api/ged';
import { gedQueryKeys } from '../../../../utils/constants/queryKeys/ged';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import styles from './RenameModal.module.scss';

const yupSchema = yup.object({
  name: yup
    .string()
    .required('Le nom du dossier est requis')
    .matches(fileFolderValidationRegex, 'Le nom du dossier ne peut contenir les caractères suivants : / \\ : * ? " < > |'),
});

type GedComponentRenameModalComponentProps = Readonly<{
  id: string;
  type: FileType;
  item: FileDataTreeResponseDto;
  onClose: () => void;
}>;
export default function GedComponentRenameModalComponent({ id, type, item, onClose }: GedComponentRenameModalComponentProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: item.name,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name }: yup.InferType<typeof yupSchema>) => renameObjectOnS3(type, id, item, name),
    onMutate: () => ({ item }),
    onSuccess: (_data, _params, context) => {
      queryClient.invalidateQueries({ queryKey: gedQueryKeys.all });
      onClose();
      toast.success(`${context.item.dir ? 'Dossier' : 'Fichier'} renommé avec succès`);
    },
    onError: (error, _params, context) => {
      console.error(error);
      toast.error(`Une erreur est survenue lors du renommage du ${context?.item.dir ? 'dossier' : 'fichier'}`);
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.directory_modal} overlayClassName="Overlay">
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
    </ReactModal>
  );
}
