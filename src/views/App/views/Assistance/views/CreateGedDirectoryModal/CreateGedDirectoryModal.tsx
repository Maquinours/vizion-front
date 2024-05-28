import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateGedDirectoryModalComponent from '../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-ged-directory');

export default function AppViewAssistanceViewCreateGedDirectoryModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { assistanceId } = routeApi.useParams();
  const { relativePath } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, relativePath: undefined }), replace: true, resetScroll: false });
  };

  return <CreateGedDirectoryModalComponent type={FileType.ASSISTANCE} id={assistanceId} directoryRelativePath={relativePath ?? ''} onClose={onClose} />;
}
