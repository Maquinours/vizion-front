import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import { createTask } from '../../../../../../utils/api/task';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import ProfileResponseDto from '../../../../../../utils/types/ProfileResponseDto';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './CreatePersonalTaskModal.module.scss';
import Quill from '../../../../../../components/Quill/Quill';

const routeApi = getRouteApi('/app/dashboard/create-personal-task');

const yupSchema = yup.object({
  content: yup.string().required('Ce champ est requis'),
  profile: yup.mixed<ProfileResponseDto>().required('Ce champ est requis'),
  deadline: yup.date().required('Ce champ est requis'),
});

export default function AppViewDashboardViewCreatePersonalTaskModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { data: user } = useAuthentifiedUserQuery();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      deadline: new Date(),
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { data: members, isLoading: isLoadingMembers } = useQuery(queries.profiles.list._ctx.byCategory(CategoryClient.VIZEO));

  const { mutate, isPending } = useMutation({
    mutationFn: ({ content, profile, deadline }: yup.InferType<typeof yupSchema>) =>
      createTask({
        content,
        type: WorkloadType.PERSONELLE,
        profileId: profile.id,
        senderId: user.profile.id,
        deadline: moment(deadline).utc(true).toDate(),
        enterpriseName: user.profile.enterprise!.name,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.tasks._def });
      toast.success('Charge de travail personnelle créée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création de la charge de travail personnelle');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Ajouter une charge de travail personnelle</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label className="label" htmlFor="information">
                Quoi :
              </label>
              <Controller
                control={control}
                name="content"
                render={({ field: { value, onChange, onBlur } }) => <Quill id="information" value={value} onChange={onChange} onBlur={onBlur} />}
              />
              <p className={styles.errors}>{errors.content?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className="label" htmlFor="information">
                Qui :
              </label>
              <Controller
                control={control}
                name={'profile'}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomSelect
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={'Sélectionnez un membre'}
                    isLoading={isLoadingMembers}
                    options={members}
                    getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
                    getOptionValue={(opt) => opt.id}
                  />
                )}
              />
              <p className={styles.errors}>{errors.profile?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className="label" htmlFor="date">
                Quand :
              </label>
              <input type="date" {...register('deadline')} id="date" />
              <p className={styles.errors}>{errors.deadline?.message}</p>
            </div>

            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
