import { getRouteApi } from '@tanstack/react-router';
import DeleteGedObjectModalComponent from '../../../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/delete-ged-object/$objectRelativePath');

export default function AppViewBusinessViewDashboardViewDeleteGedObjectModalView() {
  const navigate = routeApi.useNavigate();

  const { businessId, objectRelativePath } = routeApi.useParams();
  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <DeleteGedObjectModalComponent type={FileType.AFFAIRE} id={businessId} objectRelativePath={objectRelativePath} onClose={onClose} />;
}
