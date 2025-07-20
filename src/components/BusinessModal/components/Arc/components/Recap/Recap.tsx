import { HiPencilAlt } from 'react-icons/hi';
import BusinessArcResponseDto from '../../../../../../utils/types/BusinessArcResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import CurrencyFormat from '../../../../../CurrencyFormat/CurrencyFormat';
import styles from './Recap.module.scss';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc');
// const routePath = '/app/businesses-rma/business/$businessId/arc';

type BusinessModalComponentArcComponentRecapComponentProps = Readonly<{
  business: BusinessResponseDto;
  arc: BusinessArcResponseDto;
  onUpdateShippingPriceClick: () => void;
}>;
export default function BusinessModalComponentArcComponentRecapComponent({
  business,
  arc,
  onUpdateShippingPriceClick,
}: BusinessModalComponentArcComponentRecapComponentProps) {
  // const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  // const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  return (
    <div className={styles.quote_recap}>
      <div className={styles.quote_container}>
        <table>
          <tbody>
            <tr>
              <td colSpan={2}>TOTAL GÉNÉRAL HT</td>
              <td>
                <CurrencyFormat value={arc.totalAmountHT} />
              </td>
            </tr>
            <tr>
              <td>Frais de port</td>
              <td>25</td>
              <td>
                {arc.shippingServicePrice === 0 ? 'Offert' : <CurrencyFormat value={arc.shippingServicePrice} />}{' '}
                {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && !business.archived && (
                  <button className="btn btn-secondary" onClick={onUpdateShippingPriceClick}>
                    <HiPencilAlt size={18} />
                  </button>
                )}
                {/* {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && !business.archived && (
                  <Link from={routePath} to="update-shipping-price" search replace resetScroll={false} ignoreBlocker preload="intent">
                    <HiPencilAlt size={18} color="" />
                  </Link>
                )} */}
              </td>
            </tr>
            <tr>
              <td>TVA</td>
              <td>20%</td>
              <td>
                <CurrencyFormat value={arc.vat} />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>Total TTC</td>
              <td>
                <CurrencyFormat value={arc.totalAmount} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
