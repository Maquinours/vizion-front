import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateGedDirectoryModalComponent from '../../../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support/create-ged-directory');

export default function AppViewRmaViewSupportViewCreateGedDirectoryModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { rmaId } = routeApi.useParams();
  const { relativePath } = routeApi.useSearch();

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, relativePath: undefined }), replace: true, resetScroll: false });
  };

  return <CreateGedDirectoryModalComponent type={FileType.SAV} id={rmaId} directoryRelativePath={relativePath ?? ''} onClose={onClose} />;
}
