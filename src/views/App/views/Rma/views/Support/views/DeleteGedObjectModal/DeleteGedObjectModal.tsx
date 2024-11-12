import { getRouteApi } from '@tanstack/react-router';
import DeleteGedObjectModalComponent from '../../../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/delete-ged-object/$relativePath');

export default function AppViewRmaViewSupportViewDeleteGedObjectModalView() {
  const navigate = routeApi.useNavigate();

  const { rmaId, relativePath } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <DeleteGedObjectModalComponent type={FileType.SAV} id={rmaId} objectRelativePath={relativePath} onClose={onClose} />;
}
