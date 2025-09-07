import { getRouteApi } from '@tanstack/react-router';
import LifesheetComponent from '../../../../../../components/Lifesheet/Lifesheet';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');
const routePath = '/app/enterprises/$enterpriseId';

export default function AppViewEnterpriseViewLifesheetComponent() {
  const { enterpriseId } = routeApi.useParams();
  const { lifesheetPage: page } = routeApi.useSearch();

  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.ENTERPRISE}
      associatedItemId={enterpriseId}
      page={page}
      pageLink={(page) => ({ from: routePath, search: (old) => ({ ...old, lifesheetPage: page }), replace: true, resetScroll: false })}
      createLink={{
        from: routePath,
        to: '/app/enterprises/$enterpriseId/create-lifesheet-comment',
        search: true,
        replace: true,
        resetScroll: false,
      }}
      getEmailLink={(data) => ({
        from: routePath,
        to: '/app/enterprises/$enterpriseId/lifesheet-email/$lifesheetId',
        params: { lifesheetId: data.id },
        search: true,
        replace: true,
        resetScroll: false,
      })}
      getDeleteLink={(data) => ({
        from: routePath,
        to: '/app/enterprises/$enterpriseId/delete-lifesheet/$lifesheetId',
        params: { lifesheetId: data.id },
        search: true,
        replace: true,
        resetScroll: false,
      })}
    />
  );
}
