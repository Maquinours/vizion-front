import { getRouteApi, useNavigate } from '@tanstack/react-router';
import RenameGedObjectModalComponent from '../../../../../../../../components/RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/rename-ged-object/$objectRelativePath');

export default function AppViewBusinessViewDashboardViewRenameGedObjectModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, objectRelativePath } = routeApi.useParams();

  const onClose = () => {
    navigate({
      to: '../..',
      search: (old) => old,
      replace: true,
    });
  };
  return <RenameGedObjectModalComponent type={FileType.AFFAIRE} id={businessId} objectRelativePath={objectRelativePath} onClose={onClose} />;
}
