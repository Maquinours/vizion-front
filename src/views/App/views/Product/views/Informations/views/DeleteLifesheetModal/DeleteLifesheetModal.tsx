import { getRouteApi } from '@tanstack/react-router';
import { DeleteLifesheetModalComponent } from '../../../../../../../../components/DeleteLifesheetModal/DeleteLifesheetModal';

const routeApi = getRouteApi('/app/products_/$productId/informations/delete-lifesheet-comment/$lifesheetId');

export default function AppViewProductViewInformationsViewDeleteLifesheetModalView() {
  const navigate = routeApi.useNavigate();

  const { lifesheet } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <DeleteLifesheetModalComponent lifesheet={lifesheet} onClose={onClose} />;
}
