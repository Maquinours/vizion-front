import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteDepartment } from '../../../../../../../../utils/api/department';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteModal.module.scss';

const routeApi = getRouteApi('/app/tools/departments/delete/$departmentId');

export default function AppViewToolsViewDepartmentsViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { departmentId } = routeApi.useParams();

  const { data: department } = useSuspenseQuery(queries.departments.detail._ctx.byId(departmentId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.departments._def });
      toast.success('Le département a été supprimé avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du département.');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)' }}>supprimer</span> le département{' '}
            <span style={{ color: 'var(--secondary-color)' }}>{department.name}</span> ?
          </h6>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le département définitivement.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
