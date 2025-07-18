import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { importBusinessQuotation } from '../../../../../../utils/api/businessQuotations';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../utils/enums/BusinessState';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import styles from './ConfirmOtherQuotationImportModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/confirm-quotation-import/$otherBusinessId');

type BusinessModalComponentConfirmOtherQuotationImportModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  otherBusiness: BusinessResponseDto;
  onClose: () => void;
}>;
export default function BusinessModalComponentConfirmOtherQuotationImportModalComponent({
  business,
  otherBusiness,
  onClose,
}: BusinessModalComponentConfirmOtherQuotationImportModalComponentProps) {
  const queryClient = useQueryClient();
  // const navigate = routeApi.useNavigate();

  // const { businessId, otherBusinessId } = routeApi.useParams();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  // const { data: otherBusiness } = useSuspenseQuery(queries.businesses.detail._ctx.byId(otherBusinessId));

  // const onClose = () => {
  //   navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  // };

  const { mutate, isPending } = useMutation({
    mutationFn: () => importBusinessQuotation({ business, otherBusiness }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      toast.success('Le devis a été importé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'importation du devis");
    },
  });

  return (
    <ReactModal
      isOpen={true}
      className={styles.modal}
      onRequestClose={onClose}
      overlayClassName="Overlay"
      shouldCloseOnEsc={!isPending}
      shouldCloseOnOverlayClick={!isPending}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes vous certain(e) de vouloir <span className={styles.secondary_color}>exporter le contenu du devis</span> {"l'affaire "}
            {otherBusiness.numBusiness} {"dans l'affaire courante ?"}
          </h6>
        </div>
        <div className={styles.modal_content}>
          {(business.state === BusinessState.CREATED || business.state === BusinessState.DEVIS) && (
            <p className={styles.text}>
              {business.state === BusinessState.CREATED ? (
                <>
                  Cette action irréversible va <span className={styles.bold}>créér</span> le devis de cette affaire.
                </>
              ) : (
                <>
                  Cette action irréversible va <span className={styles.bold}>modifier</span> le devis déjà existant de cette affaire.
                </>
              )}
              <p>
                {"Veuillez vérifier la remise appliquée à l'entreprise "}
                {/* <Link to="/app/enterprises/$enterpriseId" params={{ enterpriseId: otherBusiness.enterpriseId }} target="_blank" className="text-secondary"> */}
                {otherBusiness.enterpriseName}
                {/* </Link> */} avant de continuer.
              </p>
            </p>
          )}
        </div>

        <div className={styles.modal_loader}>
          <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
        </div>

        <div className={styles.modal_buttons}>
          <button className="btn btn-primary-light" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-secondary" onClick={() => mutate()}>
            Exporter
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
