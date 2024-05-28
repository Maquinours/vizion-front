import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ImportGedFilesModalComponent from '../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId/import-ged-files');

export default function AppViewAssistanceViewImportGedFilesModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { assistanceId } = routeApi.useParams();
  const { directoryRelativePath } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, directoryRelativePath: undefined }), replace: true, resetScroll: false });
  };

  return <ImportGedFilesModalComponent type={FileType.ASSISTANCE} id={assistanceId} directoryRelativePath={directoryRelativePath ?? ''} onClose={onClose} />;
}
