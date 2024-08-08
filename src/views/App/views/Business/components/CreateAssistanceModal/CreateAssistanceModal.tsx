import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { createTechnicalSupport } from '../../../../../../utils/api/technicalSupports';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BillType from '../../../../../../utils/enums/BillType';
import { formatDateWithSlash } from '../../../../../../utils/functions/dates';
import styles from './CreateAssistanceModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId');

export default function AppViewBusinessViewCreateAssistanceModalComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();
  const { businessModal } = routeApi.useSearch();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClose = () => {
    navigate({ search: { businessModal: undefined }, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const bill = (await queryClient.ensureQueryData(queries['business-bills'].list._ctx.byBusinessId(businessId)))?.find(
        (bill) => bill.type === BillType.FACTURE,
      );
      return createTechnicalSupport({
        name: '',
        enterpriseId: business.enterpriseId,
        enterpriseName: business.enterpriseName,
        businessNum: business.numBusiness,
        predefinedTime: '00:00:00',
        cumulatedTime: '00:00:00',
        noBilledTime: '00:00:00',
        recaps: !!bill?.createdDate ? [{ name: 'Date de facturation', value: formatDateWithSlash(bill.createdDate) }] : undefined,
      });
    },
    onSuccess: (technicalSupport) => {
      queryClient.invalidateQueries({ queryKey: queries['technical-supports']._def });
      queryClient.setQueryData(queries['technical-supports'].detail._ctx.byId(technicalSupport.id).queryKey, technicalSupport);
      toast.success("L'assistance a été créée avec succès.");
      navigate({ to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId', params: { assistanceId: technicalSupport.id } });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'assistance.");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal
      isOpen={businessModal === 'create-assistance'}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={!isPending}
      shouldCloseOnEsc={!isPending}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Confirmation</h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>Voulez-vous créér une nouvelle assistance pour cette affaire ?</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" type="reset">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
