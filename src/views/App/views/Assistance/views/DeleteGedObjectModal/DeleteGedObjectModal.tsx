import { getRouteApi } from '@tanstack/react-router';
import DeleteGedObjectModalComponent from '../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/delete-ged-object/$objectRelativePath');

export default function AppViewAssistanceViewDeleteGedObjectModalView() {
  const navigate = routeApi.useNavigate();

  const { assistanceId, objectRelativePath } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <DeleteGedObjectModalComponent type={FileType.ASSISTANCE} id={assistanceId} objectRelativePath={objectRelativePath} onClose={onClose} />;
}
