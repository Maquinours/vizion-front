import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../../../components/Quill/Quill';
import { uploadFiles } from '../../../../../../../../utils/api/files';
import { createFormation } from '../../../../../../../../utils/api/formations';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import UploadedFile from '../../../../../../../../utils/types/UploadedFile';
import styles from './CreateModal.module.scss';
import { FormationDetail, FormationDetailsContext } from './utils/contexts/context';

const routeApi = getRouteApi('/app/tools/formations/create');

const yupSchema = yup.object().shape({
  title: yup.string().required('Le titre est requis.'),
  subtitle: yup.string().required('La description est requise'),
  archive: yup.string().required('Le champs est requis'),
  content: yup.string().required('Le contenu est requis'),
  files: yup.array().of(yup.mixed<File>().required()).required(),
  details: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required('Champs requis'),
        formationDate: yup.string().required('Champs requis'),
        startTime: yup.string().required('Champs requis'),
        endTime: yup.string().required('Champs requis'),
        trainers: yup.array().of(yup.mixed<ProfileResponseDto>().required()).min(1, 'Au moins un formateur').required('Champs requis'),
      }),
    )
    .required(),
});

export default function AppViewToolsViewFormationsViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      details: [],
      files: [],
    },
  });

  const details = useWatch({ name: 'details', control });

  const contextValue = useMemo(
    () => ({
      details: details,
      setDetails: (details: Array<FormationDetail>) => setValue('details', details),
    }),
    [getValues, setValue, details],
  );

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setValue('files', [...getValues('files'), ...acceptedFiles]);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ title, subtitle, archive, content, files, details }: yup.InferType<typeof yupSchema>) =>
      createFormation({
        title,
        subtitle,
        content,
        files:
          files.length > 0
            ? (await uploadFiles(files)).content.reduce((acc: Record<string, UploadedFile>, file, index) => {
                acc['file' + index] = file;
                return acc;
              }, {})
            : {},
        archived: archive === 'Oui' ? true : false,
        formationDetails: details.map((detail) => ({
          title: detail.title,
          formationDate: detail.formationDate,
          startTime: `${detail.startTime}:00`,
          endTime: `${detail.endTime}:00`,
          trainers: detail.trainers.reduce((acc: Record<string, object>, trainer, index) => {
            acc['trainer' + index] = { label: `${trainer.firstName} ${trainer.lastName}`, value: trainer.id };
            return acc;
          }, {}),
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.formations._def });
      toast.success('Formation ajoutée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erreur lors de l'ajout de la formation");
    },
  });

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.container}>
          <div className={styles.header}>
            <button className="btn btn-secondary" onClick={handleSubmit((data) => mutate(data))}>
              Ajouter une formation
            </button>
          </div>
          <div className={styles.news_container}>
            <div className={styles.content}>
              <div className={styles.details_buttons}>
                <Link from={routeApi.id} to="add-detail" search replace resetScroll={false} preload="intent" className="btn btn-primary">
                  Ajouter un détail
                </Link>
                <Link from={routeApi.id} to="details" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
                  Voir les détails
                </Link>
              </div>
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
                  <label htmlFor="archive">A archiver</label>
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
                    render={({ field: { value, onChange } }) => <Quill value={value} onChange={onChange} placeholder="Contenu" />}
                  />
                  <p className={styles.__errors}>{errors.content?.message}</p>
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
                    render={({ field: { value, onChange } }) =>
                      value && value.length > 0 ? (
                        <div className={styles.selected_files}>
                          <h4>Fichiers</h4>
                          <ul>
                            {value.map((file) => (
                              <li key={file.name}>
                                <span>{file.name}</span>
                                <button onClick={() => onChange(value.filter((f) => f.name !== file.name))}>
                                  <FaTrash color="#F24C52" width="14" height="14" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <></>
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
          </div>
        </div>
      </ReactModal>
      <FormationDetailsContext.Provider value={contextValue}>
        <Outlet />
      </FormationDetailsContext.Provider>
    </>
  );
}
