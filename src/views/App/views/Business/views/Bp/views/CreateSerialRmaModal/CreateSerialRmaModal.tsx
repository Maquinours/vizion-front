import ReactModal from 'react-modal';
import styles from './CreateSerialRmaModal.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { createRmaFromBusiness } from '../../../../../../../../utils/api/rma';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp/create-serial-rma/$serialId');

export default function AppViewBusinessViewBpViewCreateSerialRmaModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, serialId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: serialNumber } = useSuspenseQuery(queries['business-bp-serials'].detail._ctx.byId(serialId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => createRmaFromBusiness(CategoryBusiness.AFFAIRE, business.numBusiness, [serialNumber.numSerie]),
    onSuccess: (rma) => {
      queryClient.invalidateQueries({ queryKey: queries.rmas._def });
      toast.success('Le RMA a été généré avec succès');
      navigate({ to: '/app/businesses-rma/rma/$rmaId', params: { rmaId: rma.id } });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du RMA');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal
      isOpen={true}
      overlayClassName="Overlay"
      className={styles.modal}
      shouldCloseOnOverlayClick={!isPending}
      shouldCloseOnEsc={!isPending}
      onRequestClose={onClose}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>générer</span> un RMA pour la{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}> {serialNumber.productReference} </span> de numéro de série{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}> {serialNumber.numSerie} </span> ?
          </h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Générer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
