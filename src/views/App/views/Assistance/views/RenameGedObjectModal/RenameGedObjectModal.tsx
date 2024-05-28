import { getRouteApi } from '@tanstack/react-router';
import RenameGedObjectModalComponent from '../../../../../../components/RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../../../../../utils/enums/FileType';
import { useNavigate } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId/rename-ged-object/$objectRelativePath');

export default function AppViewAssistanceViewRenameGedObjectModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { assistanceId, objectRelativePath } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };
  return <RenameGedObjectModalComponent type={FileType.ASSISTANCE} id={assistanceId} objectRelativePath={objectRelativePath} onClose={onClose} />;
}
