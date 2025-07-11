import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import styles from './Header.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/reception');

type RmaModalComponentReceptionComponentHeaderComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  onCreateDetailClick: () => void;
  onEditClick: () => void;
}>;
export default function RmaModalComponentReceptionComponentHeaderComponent({
  rma,
  onCreateDetailClick,
  onEditClick,
}: RmaModalComponentReceptionComponentHeaderComponentProps) {
  // const { rmaId } = routeApi.useParams();
  // const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  return (
    <div className={styles.header}>
      <div className={styles.buttons_container}>
        {rma.state !== 'ARCHIVE' && (
          <button className="btn btn-primary" onClick={onCreateDetailClick}>
            Ajouter un article
          </button>
          // <Link
          //   from="/app/businesses-rma/rma/$rmaId/reception"
          //   to="create-detail"
          //   search
          //   replace
          //   resetScroll={false}
          //   preload="intent"
          //   className="btn btn-primary"
          // >
          //   Ajouter un article
          // </Link>
        )}
        <button className="btn btn-secondary" onClick={onEditClick}>
          Éditer
        </button>
        {/* <Link from="/app/businesses-rma/rma/$rmaId/reception" to="pdf" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Éditer
        </Link> */}
      </div>
    </div>
  );
}
