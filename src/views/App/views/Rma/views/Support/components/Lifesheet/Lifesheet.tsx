import { getRouteApi } from '@tanstack/react-router';
import LifesheetComponent from '../../../../../../../../components/Lifesheet/Lifesheet';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support');

export default function AppViewRmaViewSupportViewLifesheetComponent() {
  const { rmaId } = routeApi.useParams();
  const { lifesheetPage } = routeApi.useSearch();

  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.RMA}
      associatedItemId={rmaId}
      page={lifesheetPage}
      size={5}
      createLink={{ to: '/app/businesses-rma/rma/$rmaId/support/create-lifesheet', params: true, search: true, replace: true, resetScroll: false }}
      pageLink={(page) => ({ search: (old) => ({ ...old, page }), replace: true, resetScroll: false })}
    />
  );
}
