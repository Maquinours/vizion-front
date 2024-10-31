import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createDepartment } from '../../../../../../../../utils/api/department';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './CreateModal.module.scss';

const routeApi = getRouteApi('/app/tools/departments/create');

const yupSchema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  code: yup.string().required('Le code est requis'),
});

export default function AppViewToolsViewDepartmentsViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name, code }: yup.InferType<typeof yupSchema>) => createDepartment({ name, code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.departments._def });
      toast.success('Le département a été ajouté avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du département.");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un département</h6>
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
