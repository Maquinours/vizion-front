import { getRouteApi } from '@tanstack/react-router';
import ImportGedFilesModalComponent from '../../../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/import-ged-files');

export default function AppViewRmaViewSupportViewImportGedFilesModalView() {
  const navigate = routeApi.useNavigate();

  const { rmaId } = routeApi.useParams();
  const { relativePath } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, relativePath: undefined }), replace: true, resetScroll: false });
  };

  return <ImportGedFilesModalComponent type={FileType.SAV} id={rmaId} directoryRelativePath={relativePath ?? ''} onClose={onClose} />;
}
