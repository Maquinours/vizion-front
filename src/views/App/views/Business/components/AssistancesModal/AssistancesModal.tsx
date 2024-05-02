import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './AssistancesModal.module.scss';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId');

export default function AppViewBusinessViewAssistancesModalComponent() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();
  const { businessModal } = routeApi.useSearch();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { data } = useQuery(
    queries['technical-supports'].list._ctx.byBusinessOrRmaNumber({ categoryBusiness: CategoryBusiness.AFFAIRE, number: business.numBusiness }),
  );

  const onClose = () => {
    navigate({ search: { businessModal: undefined } });
  };

  return (
    <ReactModal isOpen={businessModal === 'assistances'} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Assistances de l&apos;affaire</h6>
        </div>
        <form onReset={onClose}>
          <div className={styles.modal_content}>
            <ul>
              {data?.map((el) => (
                <li key={el.id}>
                  {/* <Link to={`/app/business/assistance/${el.id}`}>{el.name ?? `Assistance ${el.businessTitle}/${el.businessNumber}`}</Link> TODO: add link to assistance page */}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.modal_buttons}>
            <Link from={routeApi.id} search={(old) => ({ ...old, businessModal: 'create-assistance' })} className="btn btn-secondary">
              Ajouter une assistance
            </Link>
            <button type="reset" className="btn btn-secondary">
              Fermer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
