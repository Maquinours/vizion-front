import { getRouteApi, useNavigate } from '@tanstack/react-router';
import RenameGedObjectModalComponent from '../../../../../../../../components/RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support/rename-ged-object/$objectRelativePath');

export default function AppViewRmaViewSupportViewRenameGedObjectModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { rmaId, objectRelativePath } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <RenameGedObjectModalComponent type={FileType.SAV} id={rmaId} objectRelativePath={objectRelativePath} onClose={onClose} />;
}
