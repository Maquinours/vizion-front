import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CardComponent from '../../../../../../../../components/Card/Card';
import styles from './BillingAddress.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

export default function AppViewBusinessViewDashboardViewBillingAddressComponent() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <div className={styles.container}>
      <CardComponent
        title="Adresse de facturation"
        className="h-full"
        editLink={
          !business.archived && user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO')
            ? {
                from: routeApi.id,
                to: '/app/businesses-rma/business/$businessId/dashboard/update-billing-address',
                search: true,
                replace: true,
                resetScroll: false,
                preload: 'intent',
                ignoreBlocker: true,
              }
            : undefined
        }
      >
        <div className={styles.details_container}>
          <div className={styles.details}>
            <div className={styles.title}>Société</div>
            <Link to="/app/enterprises/$enterpriseId" params={{ enterpriseId: business.enterpriseId }} className={styles.content}>
              {business.billingCompany ?? business.enterpriseName}
            </Link>
          </div>
          <div className={styles.details}>
            <div className={styles.title}>Nom</div>
            <div className={styles.content}>{business.billingName ?? business.profileName ?? 'Aucune donnée'}</div>
          </div>
          <div className={styles.details}>
            <div className={styles.title}>Adresse 1</div>
            <div className={styles.content}>{business.billingAddressOne ?? 'Aucune donnée'}</div>
          </div>
          <div className={styles.details}>
            <div className={styles.title}>Adresse 2</div>
            <div className={styles.content}>{business.billingAddressTwo ?? 'Aucune donnée'}</div>
          </div>
          <div className={styles.details}>
            <div className={styles.title}>CP+Ville</div>
            <div className={styles.content}>
              {business.billingZipCode} {business.billingCity}
            </div>
          </div>
          <div className={styles.details}>
            <div className={styles.title}>Téléphone</div>
            <div className={styles.content}>{business.billingPhoneNumber ?? 'Aucune donnée'}</div>
          </div>
          <div className={styles.details}>
            <div className={styles.title}>Mail</div>
            <div className={styles.content}>{business.billingEmail ?? business.profileEmail ?? 'Aucune donnée'}</div>
          </div>
        </div>
      </CardComponent>
    </div>
  );
}
