import { getRouteApi } from '@tanstack/react-router';
import RenameGedObjectModalComponent from '../../../../../../components/RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/rename-ged-object/$objectRelativePath');

export default function AppViewEnterpriseViewRenameGedObjectModalView() {
  const navigate = routeApi.useNavigate();

  const { enterpriseId, objectRelativePath } = routeApi.useParams();

  return (
    <RenameGedObjectModalComponent
      type={FileType.CONTACT}
      id={enterpriseId}
      objectRelativePath={decodeURIComponent(objectRelativePath)}
      onClose={() =>
        navigate({
          to: '../..',
          search: true,
          replace: true,
          resetScroll: false,
        })
      }
    />
  );
}
