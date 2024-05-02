import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import { updateDepartment } from '../../../../../../../../utils/api/department';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import styles from './UpdateModal.module.scss';
import { PulseLoader } from 'react-spinners';

const yupSchema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  code: yup.string().required('Le code est requis'),
});

const routeApi = getRouteApi('/app/tools/departments/update/$departmentId');

export default function AppViewToolsViewDepartmentsViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { departmentId } = routeApi.useParams();

  const { data: department } = useSuspenseQuery(queries.departments.detail._ctx.byId(departmentId));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name, code }: yup.InferType<typeof yupSchema>) => updateDepartment(department.id, { name, code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.departments._def });
      toast.success('Le département a été modifié avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du département.');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Modifier le département <span style={{ color: 'var(--secondary-color)' }}>{department.name}</span>
          </h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className="label" htmlFor="departmentName">
              Nom
            </label>
            <input id="departmentName" type="text" placeholder="..." {...register('name')} />
            <p className={styles.__errors}>{errors.name?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className="label" htmlFor="departmentCode">
              Code
            </label>
            <input id="departmentCode" type="text" placeholder="..." {...register('code')} />
            <p className={styles.__errors}>{errors.code?.message}</p>
          </div>
          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
