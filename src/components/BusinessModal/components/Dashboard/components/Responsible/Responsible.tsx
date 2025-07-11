import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';
import CardComponent from '../../../../../Card/Card';
import styles from './Responsible.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');

type BusinessModalComponentDashboardComponentResponsibleComponentProps = Readonly<{
  business: BusinessResponseDto;
  onEdit: () => void;
}>;
export default function BusinessModalComponentDashboardComponentResponsibleComponent({
  business,
  onEdit,
}: BusinessModalComponentDashboardComponentResponsibleComponentProps) {
  // const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <div className={styles.container}>
      <CardComponent
        title="Chargé d'affaire"
        onEdit={!business.archived && user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') ? onEdit : undefined}
        // editLink={
        //   !business.archived && user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')
        //     ? {
        //         to: '/app/businesses-rma/business/$businessId/dashboard/update-responsible',
        //         search: true,
        //         replace: true,
        //         resetScroll: false,
        //         preload: 'intent',
        //         ignoreBlocker: true,
        //       }
        //     : undefined
        // }
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
