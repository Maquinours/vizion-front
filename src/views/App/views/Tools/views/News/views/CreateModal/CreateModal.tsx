import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../../../components/Quill/Quill';
import { uploadFiles } from '../../../../../../../../utils/api/files';
import { createNews } from '../../../../../../../../utils/api/news';
import { news } from '../../../../../../../../utils/constants/queryKeys/news';
import UploadedFile from '../../../../../../../../utils/types/UploadedFile';
import styles from './CreateModal.module.scss';

const routeApi = getRouteApi('/app/tools/news/create');

const yupSchema = yup.object({
  title: yup.string().required('Le titre est requis.'),
  subtitle: yup.string().required('La description est requise'),
  archive: yup.string().required('Le champs est requis'),
  content: yup.string().required('Le contenu est requis'),
  files: yup.array().of(yup.mixed<File>().required()).default([]),
});

export default function AppViewToolsViewNewsViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const {
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      files: [],
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: Array<File>) => {
      setValue('files', [...getValues('files'), ...acceptedFiles]);
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ title, subtitle, archive, content, files }: yup.InferType<typeof yupSchema>) =>
      createNews({
        title,
        subtitle,
        content,
        archived: archive === 'Oui',
        files: (await uploadFiles(files)).content.reduce((acc: Record<string, UploadedFile>, file, index) => {
          acc['file' + index] = file;
          return acc;
        }, {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: news._def });
      toast.success('Actualité ajoutée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout de l'actualité");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Ajouter une actualité</p>
        </div>

        <div className={styles.content}>
          <div className={styles.inputs_container}>
            <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
              <div className={styles.form_content}>
                <div className={styles.row_one}>
                  <div className={styles.form_group}>
                    <label htmlFor="title">Titre</label>
                    <input id="title" {...register('title')} />
                    <p className={styles.__errors}>{errors.title?.message}</p>
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="subtitle">Sous titre</label>
                    <input placeholder="Sous titre" id="subtitle" {...register('subtitle')} />
                    <p className={styles.__errors}>{errors.subtitle?.message}</p>
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="archive">Archivé</label>
                    <select id="archive" {...register('archive')} autoComplete="off" defaultValue="Non">
                      {['Oui', 'Non'].map((itm, idx) => {
                        return <option key={idx} value={itm} label={itm} />;
                      })}
                    </select>
                    <p className={styles.__errors}>{errors.archive?.message}</p>
                  </div>
                </div>
                <div className={styles.row_two}>
                  <div className={styles.body_container}>
                    <Controller
                      control={control}
                      name="content"
                      render={({ field: { value, onChange, onBlur } }) => <Quill value={value} onChange={onChange} onBlur={onBlur} />}
                    />
                    <p className="__errors">{errors.content?.message}</p>
                  </div>
                  <div className={styles.dropzone_container}>
                    <div {...getRootProps({ className: 'dropzone' })}>
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Deposer le(s) fichier(s) dans la zone.</p>
                      ) : (
                        <div className="plus">
                          <p>Cliquer pour ajouter un fichier</p>
                          <MdAdd size="45" color="#F24C52" />
                        </div>
                      )}
                    </div>
                    <Controller
                      control={control}
                      name="files"
                      render={({ field: { value, onChange } }) => (
                        <>
                          {value.length > 0 && (
                            <div className={styles.selected_files}>
                              <h4>Fichiers</h4>
                              <ul>
                                {value.map((file, index) => (
                                  <li key={file.name}>
                                    <span>{file.name}</span>
                                    <button onClick={() => onChange(value.filter((_f, i) => i !== index))}>
                                      <FaTrash color="#F24C52" width={14} height={14} />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '1rem 0',
                }}
              >
                <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
              </div>
              <div className={styles.buttons}>
                <button className="btn btn-primary-light" type="reset">
                  Annuler
                </button>
                <button className="btn btn-secondary" type="submit">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
