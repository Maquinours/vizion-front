import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteRdv } from '../../../../../../../../../../utils/api/rdv';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteModal.module.scss';

const routeApi = getRouteApi('/app/tools/scheduler/details/$rdvId/delete');

export default function AppViewToolsViewSchedulerViewDetailsModalViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { rdvId } = routeApi.useParams();

  const { data: rdv } = useSuspenseQuery(queries.rdvs.detail(rdvId));

  const onClose = () => {
    navigate({ from: routeApi.id, to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteRdv(rdvId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.rdvs._def });
      toast.success('Rendez-vous supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du rendez-vous');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.delete_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Supprimer un rendez-vous</p>
        </div>

        <div className={styles.modal_content}>
          <p>
            Vous êtes sur le point de supprimer le rendez-vous de{' '}
            <span>{rdv.infos.map((info) => `${info.attributeToFirstName} ${info.attributeToLastName}`).join(', ')}</span> ayant pour objet{' '}
            <span className={styles.title}>{rdv.title}.</span>
          </p>
          <p> Cette action est irréversible et va supprimer le rendez-vous définitivement </p>
        </div>

        <div className={styles.modal_loader}>
          <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
        </div>

        <div className={styles.modal_footer}>
          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
              Annuler
            </button>
            <button className="btn btn-secondary" onClick={() => mutate()}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
