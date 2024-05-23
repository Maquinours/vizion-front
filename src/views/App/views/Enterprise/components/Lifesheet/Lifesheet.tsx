import { getRouteApi } from '@tanstack/react-router';
import LifesheetComponent from '../../../../../../components/Lifesheet/Lifesheet';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

export default function AppViewEnterpriseViewLifesheetComponent() {
  const { enterpriseId } = Route.useParams();
  const { lifesheetPage: page } = Route.useSearch();

  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.ENTERPRISE}
      associatedItemId={enterpriseId}
      page={page}
      pageLink={(page) => ({ from: Route.id, search: (old) => ({ ...old, lifesheetPage: page }), params: (old) => old })}
      createLink={{ from: Route.id, to: '/app/enterprises/$enterpriseId/create-lifesheet-comment', search: (old) => old, params: (old) => old, replace: true }}
    />
  );
}
