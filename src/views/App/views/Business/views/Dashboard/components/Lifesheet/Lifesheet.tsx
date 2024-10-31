import { getRouteApi } from '@tanstack/react-router';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';
import styles from './Lifesheet.module.scss';
import LifesheetComponent from '../../../../../../../../components/Lifesheet/Lifesheet';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');
const routePath = '/app/businesses-rma/business/$businessId/dashboard';

export default function AppViewBusinessViewDashboardViewLifesheetComponent() {
  const { businessId } = routeApi.useParams();
  return (
    <div className={styles.first_grid}>
      <LifesheetComponent
        associatedItemType={LifesheetAssociatedItem.BUSINESS}
        associatedItemId={businessId}
        page={0}
        size={100}
        createLink={{
          from: routePath,
          to: '/app/businesses-rma/business/$businessId/dashboard/create-lifesheet',
          search: (old) => old,
          replace: true,
          resetScroll: false,
          ignoreBlocker: true,
        }}
        getEmailLink={(data) => ({
          from: routePath,
          to: '/app/businesses-rma/business/$businessId/dashboard/lifesheet-email/$lifesheetId',
          params: { lifesheetId: data.id },
          search: true,
          ignoreBlocker: true,
        })}
      />
    </div>
  );
}
