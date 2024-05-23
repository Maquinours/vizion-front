import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import { deleteEnterprise } from './utils/api/enterprise';
import { toast } from 'react-toastify';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import styles from './DeleteModal.module.scss';
import React from 'react';

const Route = getRouteApi('/app/enterprises/$enterpriseId/delete');

export default function AppViewEnterpriseViewDeleteModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { enterpriseId } = Route.useParams();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const onClose = () => {
    navigate({ from: Route.id, to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteEnterprise(enterprise),
    onMutate: () => ({ enterprise }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enterprises._def });
      navigate({
        from: Route.id,
        to: '/app/enterprises',
        search: { mobileSidebar: undefined, appModal: undefined, businessId: undefined, gedItemKey: undefined, page: 0 },
      });
      toast.success('Entreprise supprimée avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la suppression de l'entreprise");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} shouldCloseOnOverlayClick={!isPending} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>{"Suppression d'une entreprise"}</h6>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.content}>
            <p>
              {" Vous êtes sur le point de supprimer l'entreprise "}
              <span style={{ color: 'var(--secondary-color)' }}>{enterprise.name}</span>.
            </p>
            <p>
              Cette action supprimera également les différents <span style={{ color: 'var(--secondary-color)' }}>contacts (profils)</span> liés à cette
              entreprise. Voulez-vous continuer ?
            </p>
          </div>

          <div className={styles.loader}>
            <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.buttons}>
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
