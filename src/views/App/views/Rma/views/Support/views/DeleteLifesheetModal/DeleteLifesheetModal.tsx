import { getRouteApi } from '@tanstack/react-router';
import { DeleteLifesheetModalComponent } from '../../../../../../../../components/DeleteLifesheetModal/DeleteLifesheetModal';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/delete-lifesheet/$lifesheetId');

export default function AppViewRmaViewSupportViewDeleteLifesheetModalView() {
  const navigate = routeApi.useNavigate();

  const { lifesheet } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <DeleteLifesheetModalComponent lifesheet={lifesheet} onClose={onClose} />;
}
