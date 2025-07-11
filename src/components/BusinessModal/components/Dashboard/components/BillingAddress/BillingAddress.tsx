import { Link } from '@tanstack/react-router';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';
import CardComponent from '../../../../../Card/Card';
import styles from './BillingAddress.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');

type BusinessModalComponentDashboardComponentBillingAddressComponentProps = Readonly<{
  business: BusinessResponseDto;
  onEditClick: () => void;
}>;
export default function BusinessModalComponentDashboardComponentBillingAddressComponent({
  business,
  onEditClick,
}: BusinessModalComponentDashboardComponentBillingAddressComponentProps) {
  // const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(business.id));

  return (
    <div className={styles.container}>
      <CardComponent
        title="Adresse de facturation"
        className="h-full"
        onEdit={!business.archived && user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') ? onEditClick : undefined}
        // editLink={
        //   !business.archived && user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO')
        //     ? {
        //         to: '/app/businesses-rma/business/$businessId/dashboard/update-billing-address',
        //         search: true,
        //         replace: true,
        //         resetScroll: false,
        //         preload: 'intent',
        //         ignoreBlocker: true,
        //       }
        //     : undefined
        // }
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
