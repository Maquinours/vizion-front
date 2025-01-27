import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { unrelateAllBusinessToEnterprise } from '../../../../../../utils/api/allBusiness';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import styles from './UnrelateBusinessRmaModal.module.scss';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/unrelate-business-rma/$businessRmaId');

export default function AppViewEnterpriseViewUnrelateBusinessRmaModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { enterpriseId, businessRmaId } = routeApi.useParams();

  const { data: enterprise } = useSuspenseQuery(queries.enterprise.detail(enterpriseId));
  const { data: businessRma } = useSuspenseQuery(queries['all-businesses'].detail._ctx.byId(businessRmaId));

  const businessTypeString = useMemo(() => {
    switch (businessRma.category) {
      case CategoryBusiness.AFFAIRE:
        return "l'affaire";
      case CategoryBusiness.RMA:
        return 'le RMA';
    }
  }, [businessRma.category]);

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => unrelateAllBusinessToEnterprise(businessRmaId, enterpriseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['all-businesses']._def });
      toast.success(`Le lien entre ${businessTypeString} ${businessRma.number} et l'entreprise ${enterprise.name} a bien été supprimé`);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression de cette affaire de votre entreprise');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> le lien entre l&apos;entreprise{' '}
            <span className="font-bold text-[var(--secondary-color)]">{enterprise.name}</span> et {businessTypeString}{' '}
            <span className="font-bold text-[var(--secondary-color)]">
              {businessRma.title ? `${businessRma.title} / ` : ''}
              {businessRma.number}
            </span>{' '}
            ?
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            <p>{`Cette action va supprimer le lien et non ${businessTypeString}`}</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
