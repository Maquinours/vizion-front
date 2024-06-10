import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './AddDetailModal.module.scss';
import { Controller, useForm } from 'react-hook-form';
import CustomSelect from '../../../../../../../../../../components/CustomSelect/CustomSelect';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../../../../../utils/enums/CategoryClient';
import ProfileResponseDto from '../../../../../../../../../../utils/types/ProfileResponseDto';
import { useContext } from 'react';
import { FormationDetailsContext } from '../../utils/contexts/context';

const routeApi = getRouteApi('/app/tools/formations/create');

const yupSchema = yup.object().shape({
  title: yup.string().required('Champs requis'),
  formationDate: yup.string().required('Champs requis'),
  startTime: yup.string().required('Champs requis'),
  endTime: yup.string().required('Champs requis'),
  trainers: yup.array().of(yup.mixed<ProfileResponseDto>().required()).min(1, 'Au moins un formateur').required('Champs requis'),
});

export default function AppViewToolsViewFormationsViewCreateModalViewAddDetailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { details, setDetails } = useContext(FormationDetailsContext)!;

  const { data: vizeoMembers, isLoading: isLoadingVizeoMembers } = useQuery(queries.profiles.list._ctx.byCategory(CategoryClient.VIZEO));

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      trainers: [],
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const onSubmit = ({ title, formationDate, startTime, endTime, trainers }: yup.InferType<typeof yupSchema>) => {
    setDetails([...details, { title, formationDate, startTime, endTime, trainers }]);
    onClose();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Detail de la formation</p>
        </div>

        <div className={styles.content}>
          <form onSubmit={handleSubmit(onSubmit)} onReset={() => onClose()}>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="title">
                Titre
              </label>
              <input type="text" {...register('title')} id="title" />
              <p className={styles.__errors}>{errors.title?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="formationDate">
                Date de formation
              </label>
              <input type="date" {...register('formationDate')} id="formationDate" min={new Date().toISOString().split('T')[0]} />
              <p className={styles.__errors}>{errors.formationDate?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="startTime">
                Heure de début
              </label>
              <input type="time" {...register('startTime')} id="startTime" />
              <p className={styles.__errors}>{errors.startTime?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="endTime">
                Heure de fin
              </label>
              <input type="time" {...register('endTime')} id="endTime" />
              <p className={styles.__errors}>{errors.endTime?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="trainers">
                Formateur(s)
              </label>
              <Controller
                control={control}
                name="trainers"
                render={({ field: { value, onChange } }) => (
                  <CustomSelect
                    options={vizeoMembers}
                    isLoading={isLoadingVizeoMembers}
                    getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
                    getOptionValue={(opt) => opt.id}
                    value={value}
                    placeholder="Choisir..."
                    onChange={onChange}
                    isMulti
                  />
                )}
              />
              <p className={styles.__errors}>{errors.trainers?.message}</p>
            </div>
            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" type="reset">
                Annuler
              </button>
              <button className="btn btn-secondary" type="submit">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
