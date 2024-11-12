import { getRouteApi } from '@tanstack/react-router';
import ImportGedFilesModalComponent from '../../../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/import-ged-files');

export default function AppViewBusinessViewDashboardViewImportGedFilesModalView() {
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();
  const { relativePath } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, relativePath: undefined }), replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <ImportGedFilesModalComponent type={FileType.AFFAIRE} id={businessId} directoryRelativePath={relativePath} onClose={onClose} />;
}
