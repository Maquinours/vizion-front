import { Outlet } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Support.module.scss';
import AppViewRmaViewSupportViewGedComponent from './components/Ged/Ged';
import AppViewRmaViewSupportViewHeaderComponent from './components/Header/Header';
import AppViewRmaViewSupportViewLifesheetComponent from './components/Lifesheet/Lifesheet';
import AppViewRmaViewSupportViewReturnAddressComponent from './components/ReturnAddress/ReturnAddress';
import AppViewRmaViewSupportViewTableComponent from './components/Table/Table';
import AppViewRmaViewSupportViewTasksComponent from './components/Tasks/Tasks';
import BusinessRmaLinksComponent from '../../../../../../components/BusinessRmaLinks/BusinessRmaLinks';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { getRouteApi } from '@tanstack/react-router';
import AssistanceState from '../../../../../../utils/enums/AssistanceState';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

export default function AppViewRmaViewSupportView() {
  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const { rmaId } = routeApi.useParams();
  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  return (
    <>
      <div className={styles.container}>
        <AppViewRmaViewSupportViewHeaderComponent />
        <div className={styles.grid}>
          <AppViewRmaViewSupportViewTableComponent />
          <AppViewRmaViewSupportViewReturnAddressComponent />
        </div>
        <div className={styles.second_grid}>
          <AppViewRmaViewSupportViewLifesheetComponent />
          <AppViewRmaViewSupportViewGedComponent />
          {authentifiedUser.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
            <AppViewRmaViewSupportViewTasksComponent />
          )}
          <BusinessRmaLinksComponent
            category={CategoryBusiness.RMA}
            number={rma.number}
            canCreate={rma.state !== AssistanceState.ARCHIVE}
            createLink={{ to: '/app/businesses-rma/rma/$rmaId/support/create-link', search: true, replace: true, resetScroll: false, preload: 'intent' }}
            getDeleteLink={(data) => ({
              to: '/app/businesses-rma/rma/$rmaId/support/delete-link/$associatedId',
              params: { associatedId: data.id },
              search: true,
              replace: true,
              resetScroll: false,
              preload: 'intent',
            })}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}
