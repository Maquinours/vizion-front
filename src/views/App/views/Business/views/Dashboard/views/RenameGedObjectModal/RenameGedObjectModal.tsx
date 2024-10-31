import { getRouteApi } from '@tanstack/react-router';
import RenameGedObjectModalComponent from '../../../../../../../../components/RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/rename-ged-object/$objectRelativePath');

export default function AppViewBusinessViewDashboardViewRenameGedObjectModalView() {
  const navigate = routeApi.useNavigate();

  const { businessId, objectRelativePath } = routeApi.useParams();

  const onClose = () => {
    navigate({
      to: '../..',
      search: true,
      replace: true,
      resetScroll: false,
      ignoreBlocker: true,
    });
  };
  return <RenameGedObjectModalComponent type={FileType.AFFAIRE} id={businessId} objectRelativePath={objectRelativePath} onClose={onClose} />;
}
