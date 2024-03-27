import { useSuspenseQuery } from '@tanstack/react-query';
import AppViewProductViewInformationsViewInformationsCardComponent from './components/InformationsCard/InformationsCard';
import { productQueryKeys } from '../../../../../../utils/constants/queryKeys/product';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import { getProductById } from '../../../../../../utils/api/product';
import styles from './Informations.module.scss';
import AppViewProductViewInformationsViewImageComponent from './components/Image/Image';
import AppViewProductViewInformationsViewDescriptionComponent from './components/Description/Description';
import AppViewProductViewInformationsViewLifesheetComponent from './components/Lifesheet/Lifesheet';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import AppViewProductViewInformationsViewWorkloadsComponent from './components/Workloads/Workloads';
import AppViewProductViewInformationsViewGedComponent from './components/Ged/Ged';

const routeApi = getRouteApi('/app/products/$productId/informations');
export default function AppViewProductViewInformationsView() {
  const { productId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: product } = useSuspenseQuery({ queryKey: productQueryKeys.detailById(productId), queryFn: () => getProductById(productId) });

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
