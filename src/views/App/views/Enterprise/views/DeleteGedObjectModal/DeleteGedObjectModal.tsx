import { getRouteApi } from '@tanstack/react-router';
import DeleteGedObjectModalComponent from '../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/delete-ged-object/$objectRelativePath');

export default function AppViewEnterpriseViewDeleteGedObjectModalView() {
  const navigate = routeApi.useNavigate();

  const { enterpriseId, objectRelativePath } = routeApi.useParams();

  return (
    <DeleteGedObjectModalComponent
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
