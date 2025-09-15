import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import AppViewEnterpriseViewHeaderComponent from './components/Header/Header';
import AppViewEnterpriseViewInformationsComponent from './components/Informations/Informations';
import styles from './Enterprise.module.scss';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import AppViewEnterpriseViewCategoryComponent from './components/Category/Category';
import EnterpriseAllBusinessTable from './components/AllBusinessTable/AllBusinessTable';
import AppViewEnterpriseViewContactsComponent from './components/Contacts/Contacts';
import AppViewEnterpriseViewLifesheetComponent from './components/Lifesheet/Lifesheet';
import AppViewEnterpriseViewWorkloadsComponent from './components/Workloads/Workloads';
import AppViewEnterpriseViewGedComponent from './components/Ged/Ged';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');

export default function AppViewEnterpriseView() {
  const { enterpriseId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  return (
    <>
      <AppViewEnterpriseViewHeaderComponent enterprise={enterprise} />
      <div className={styles.info_section}>
        <div className={styles.grid_one}>
          <div className={styles.one}>
            <AppViewEnterpriseViewInformationsComponent enterprise={enterprise} />
            <AppViewEnterpriseViewLifesheetComponent />
          </div>
          <div className={styles.two}>
            <EnterpriseAllBusinessTable />
          </div>
        </div>
        <div className={styles.grid_two}>
          <AppViewEnterpriseViewContactsComponent />
            {user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
              <AppViewEnterpriseViewCategoryComponent enterprise={enterprise} />
            )}
            {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && <AppViewEnterpriseViewGedComponent />}
          <AppViewEnterpriseViewWorkloadsComponent />
        </div>
      </div>
      <Outlet />
    </>
  );
}
