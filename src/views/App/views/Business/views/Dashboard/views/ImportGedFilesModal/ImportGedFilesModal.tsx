import { getRouteApi, useNavigate } from '@tanstack/react-router';
import FileType from '../../../../../../../../utils/enums/FileType';
import ImportGedFilesModalComponent from '../../../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/import-ged-files');

export default function AppViewBusinessViewDashboardViewImportGedFilesModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();
  const { relativePath } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true });
  };

  return <ImportGedFilesModalComponent type={FileType.AFFAIRE} id={businessId} directoryRelativePath={relativePath} onClose={onClose} />;
}
