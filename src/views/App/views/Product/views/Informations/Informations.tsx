import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Informations.module.scss';
import AppViewProductViewInformationsViewDescriptionComponent from './components/Description/Description';
import AppViewProductViewInformationsViewGedComponent from './components/Ged/Ged';
import AppViewProductViewInformationsViewImageComponent from './components/Image/Image';
import AppViewProductViewInformationsViewInformationsCardComponent from './components/InformationsCard/InformationsCard';
import AppViewProductViewInformationsViewLifesheetComponent from './components/Lifesheet/Lifesheet';
import AppViewProductViewInformationsViewWorkloadsComponent from './components/Workloads/Workloads';

const routeApi = getRouteApi('/app/products_/$productId/informations');
export default function AppViewProductViewInformationsView() {
  const { productId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: product } = useSuspenseQuery(queries.product.detail(productId));

  return (
    <>
      <div className={styles.product_info_container}>
        <div className={styles.info_ged_container}>
          <AppViewProductViewInformationsViewInformationsCardComponent product={product} />
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && <AppViewProductViewInformationsViewGedComponent />}
        </div>
        <AppViewProductViewInformationsViewImageComponent product={product} />
        <AppViewProductViewInformationsViewDescriptionComponent product={product} />

        {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
          <div className={styles.info_lifeSheet_task_container}>
            <AppViewProductViewInformationsViewLifesheetComponent />
            <AppViewProductViewInformationsViewWorkloadsComponent />
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
}
