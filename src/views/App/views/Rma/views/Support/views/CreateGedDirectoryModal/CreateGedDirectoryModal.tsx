import { getRouteApi } from '@tanstack/react-router';
import CreateGedDirectoryModalComponent from '../../../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/create-ged-directory');

export default function AppViewRmaViewSupportViewCreateGedDirectoryModalView() {
  const navigate = routeApi.useNavigate();

  const { rmaId } = routeApi.useParams();
  const { relativePath } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, relativePath: undefined }), replace: true, resetScroll: false });
  };

  return <CreateGedDirectoryModalComponent type={FileType.SAV} id={rmaId} directoryRelativePath={relativePath ?? ''} onClose={onClose} />;
}
