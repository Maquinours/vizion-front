import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './Recap.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { HiPencilAlt } from 'react-icons/hi';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc');

export default function AppViewBusinessViewArcViewRecapComponent() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

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
                  <Link from={routeApi.id} to="update-shipping-price" search replace resetScroll={false} ignoreBlocker preload="intent">
                    <HiPencilAlt size={18} color="" />
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <td>TVA</td>
              <td>20%</td>
              <td>
                <CurrencyFormat value={((arc.totalAmountHT ?? 0) + arc.shippingServicePrice) * 0.2} />
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
