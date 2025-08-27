import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './Recap.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { HiPencilAlt } from 'react-icons/hi';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc');
const routePath = '/app/businesses-rma/business/$businessId/arc';

type AppViewBusinessViewArcViewRecapComponentProps = Readonly<{
  showAmounts: boolean;
}>;
export default function AppViewBusinessViewArcViewRecapComponent({ showAmounts }: AppViewBusinessViewArcViewRecapComponentProps) {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  if (!showAmounts) return null;
  
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
                  <Link from={routePath} to="update-shipping-price" search replace resetScroll={false} ignoreBlocker preload="intent">
                    <HiPencilAlt size={18} color="" />
                  </Link>
                )}
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
