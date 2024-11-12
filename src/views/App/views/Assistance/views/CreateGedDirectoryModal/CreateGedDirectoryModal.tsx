import { getRouteApi } from '@tanstack/react-router';
import CreateGedDirectoryModalComponent from '../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/create-ged-directory');

export default function AppViewAssistanceViewCreateGedDirectoryModalView() {
  const navigate = routeApi.useNavigate();

  const { assistanceId } = routeApi.useParams();
  const { relativePath } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, relativePath: undefined }), replace: true, resetScroll: false });
  };

  return <CreateGedDirectoryModalComponent type={FileType.ASSISTANCE} id={assistanceId} directoryRelativePath={relativePath ?? ''} onClose={onClose} />;
}
