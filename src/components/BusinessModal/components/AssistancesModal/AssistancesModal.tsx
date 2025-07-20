import { useQuery } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { queries } from '../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../utils/enums/CategoryBusiness';
import BusinessResponseDto from '../../../../utils/types/BusinessResponseDto';
import styles from './AssistancesModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId');
// const routePath = '/app/businesses-rma/business/$businessId';

type BusinessModalComponentAssistancesModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  isOpen: boolean;
  onClose: () => void;
}>;
export default function BusinessModalComponentAssistancesModalComponent({ business, isOpen, onClose }: BusinessModalComponentAssistancesModalComponentProps) {
  // const navigate = routeApi.useNavigate();

  // const { businessId } = routeApi.useParams();
  // const { businessModal } = routeApi.useSearch();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(business.id));

  const { data } = useQuery(
    queries['technical-supports'].list._ctx.byBusinessOrRmaNumber({ categoryBusiness: CategoryBusiness.AFFAIRE, number: business.numBusiness }),
  );

  // const onClose = () => {
  //   navigate({ search: { businessModal: undefined }, replace: true, resetScroll: false, ignoreBlocker: true });
  // };

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Assistances de l&apos;affaire</h6>
        </div>
        <form onReset={onClose}>
          <div className={styles.modal_content}>
            <ul>
              {data?.map((el) => (
                <li key={el.id}>
                  {/* <Link to="/app/businesses-rma/business/$businessId/assistance/$assistanceId" params={{ business.id, assistanceId: el.id }}> // TODO: add something to go to assistance modal
                    {el.name || `Assistance ${el.businessTitle}/${el.businessNumber}`}
                  </Link> */}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.modal_buttons}>
            {/* <Link from={routePath} search={(old) => ({ ...old, businessModal: 'create-assistance' })} className="btn btn-secondary">
              Ajouter une assistance
            </Link> */}
            <button type="reset" className="btn btn-secondary">
              Fermer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
