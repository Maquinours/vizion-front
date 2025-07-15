import AssistanceState from '../../../../../../utils/enums/AssistanceState';
import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import styles from './Header.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/delivery');

type RmaModalComponentDeliveryComponentHeaderComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  onCreateDetailClick: () => void;
  onEditClick: () => void;
  onTravelVoucherClick: () => void;
}>;
export default function RmaModalComponentDeliveryComponentHeaderComponent({
  rma,
  onCreateDetailClick,
  onEditClick,
  onTravelVoucherClick,
}: RmaModalComponentDeliveryComponentHeaderComponentProps) {
  // const { rmaId } = routeApi.useParams();

  // const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  return (
    <div className={styles.header}>
      <div className={styles.buttons_container}>
        {rma.state !== AssistanceState.ARCHIVE && (
          <button className="btn btn-primary" onClick={onCreateDetailClick}>
            Ajouter un article
          </button>
          // <Link
          //   from="/app/businesses-rma/rma/$rmaId/delivery"
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
        {/* <Link from="/app/businesses-rma/rma/$rmaId/delivery" to="pdf" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Éditer
        </Link> */}
        <button className="btn btn-primary" onClick={onTravelVoucherClick}>
          Éditer BT
        </button>
        {/* <Link
          from="/app/businesses-rma/rma/$rmaId/delivery"
          to="travel-voucher"
          search
          replace
          resetScroll={false}
          preload="intent"
          className="btn btn-primary"
        >
          Éditer BT
        </Link> */}
      </div>
    </div>
  );
}
