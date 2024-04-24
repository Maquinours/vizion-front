import { Link, getRouteApi } from '@tanstack/react-router';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import styles from './Recap.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { HiPencilAlt } from 'react-icons/hi';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation');

export default function AppViewBusinessViewQuotationViewRecapComponent() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries['businesses'].detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  return (
    <div className={styles.quote_recap}>
      <div className={styles.quote_container}>
        <table>
          <tbody>
            <tr>
              <td colSpan={2}>TOTAL GÉNÉRAL HT</td>
              <td>
                <CurrencyFormat value={quotation.totalAmountHT} />
              </td>
            </tr>
            <tr>
              <td>Frais de port</td>
              <td>25</td>
              <td>
                {quotation.shippingServicePrice === 0 ? 'Offert' : <CurrencyFormat value={quotation.shippingServicePrice} />}
                {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && !business.archived && (
                  <Link from={routeApi.id} to="update-shipping-price" search={(old) => old} replace>
                    <HiPencilAlt size={18} />
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <td>TVA</td>
              <td>20%</td>
              <td>
                <CurrencyFormat value={((quotation.totalAmountHT ?? 0) + quotation.shippingServicePrice) * 0.2} />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>Total TTC</td>
              <td>
                <CurrencyFormat value={quotation.totalAmount} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
