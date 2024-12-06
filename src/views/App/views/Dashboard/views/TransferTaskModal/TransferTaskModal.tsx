import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import { attributeTask } from '../../../../../../utils/api/task';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import ProfileResponseDto from '../../../../../../utils/types/ProfileResponseDto';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './TransferTaskModal.module.scss';

const routeApi = getRouteApi('/app/dashboard/transfer-task/$taskId');

const yupSchema = yup.object({
  profile: yup.mixed<ProfileResponseDto>().required("L'utilisateur est requis"),
});

export default function AppViewDashboardViewTransferCollectiveTaskModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(yupSchema) });

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const { data: allMembers, isLoading: isLoadingAllMembers } = useSuspenseQuery(queries.profiles.list._ctx.byCategory(CategoryClient.VIZEO));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ profile }: yup.InferType<typeof yupSchema>) => attributeTask(task.id, profile.id, currentUser.profile.id, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.tasks.list.queryKey });
      onClose();
      toast.success('La charge de travail a été transférée avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur s'est produite lors du transfert de la charge de travail");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Transfert de la charge {task.type === WorkloadType.COLLECTIVE ? 'collective' : 'personnelle'}</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form__custom_group}>
              <label className="label" htmlFor="profile">
                Qui :
              </label>
              <div className={styles.react_select_custom} style={{ margin: '1rem 0' }}>
                <Controller
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomSelect
                      options={allMembers}
                      isLoading={isLoadingAllMembers}
                      placeholder="Selectionnez un membre"
                      getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
                      getOptionValue={(opt) => opt.id}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                  name="profile"
                  control={control}
                />
              </div>
              <p className={styles._errors}>{errors.profile?.message}</p>
            </div>

            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button
                type="submit"
                // disabled={process}
                className="btn btn-secondary"
              >
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
