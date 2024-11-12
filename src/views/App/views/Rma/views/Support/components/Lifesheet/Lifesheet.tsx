import { getRouteApi } from '@tanstack/react-router';
import LifesheetComponent from '../../../../../../../../components/Lifesheet/Lifesheet';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

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
      pageLink={(page) => ({ search: (old) => ({ ...old, lifesheetPage: page }), replace: true, resetScroll: false })}
      getEmailLink={(data) => ({
        to: '/app/businesses-rma/rma/$rmaId/support/lifesheet-email/$lifesheetId',
        params: { lifesheetId: data.id },
        search: true,
      })}
    />
  );
}
