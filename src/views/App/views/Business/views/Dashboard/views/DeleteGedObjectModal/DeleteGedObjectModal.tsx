import { getRouteApi, useNavigate } from '@tanstack/react-router';
import FileType from '../../../../../../../../utils/enums/FileType';
import DeleteGedObjectModalComponent from '../../../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/delete-ged-object/$objectRelativePath');

export default function AppViewBusinessViewDashboardViewDeleteGedObjectModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, objectRelativePath } = routeApi.useParams();
  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  return <DeleteGedObjectModalComponent type={FileType.AFFAIRE} id={businessId} objectRelativePath={objectRelativePath} onClose={onClose} />;
}
