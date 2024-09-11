import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import CardComponent from '../../../../../../../../components/Card/Card';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Responsible.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

export default function AppViewBusinessViewDashboardViewResponsibleComponent() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <div className={styles.container}>
      <CardComponent
        title="Chargé d'affaire"
        editLink={
          !business.archived && user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')
            ? {
                from: routeApi.id,
                to: '/app/businesses-rma/business/$businessId/dashboard/update-responsible',
                search: true,
                replace: true,
                resetScroll: false,
                preload: 'intent',
                ignoreBlocker: true,
              }
            : undefined
        }
      >
        <div className={styles.content}>
          <div className={styles.details}>
            <div className={styles.title}>Nom:</div>
            <div className={styles.description}>{business.profileName}</div>
          </div>
          <div className={styles.details}>
            <div className={styles.title}>Email:</div>
            <div className={styles.description}>{business.profileEmail}</div>
          </div>
          <div className={styles.details}>
            <div className={styles.title}>Téléphone:</div>
            <div className={styles.description}>{business.profilePhone}</div>
          </div>
        </div>
      </CardComponent>
    </div>
  );
}
