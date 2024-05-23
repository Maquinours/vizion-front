import { getRouteApi, useNavigate } from '@tanstack/react-router';
import DeleteGedObjectModalComponent from '../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises/$enterpriseId/delete-ged-object/$objectRelativePath');

export default function AppViewEnterpriseViewDeleteGedObjectModalView() {
  const navigate = useNavigate();

  const { enterpriseId, objectRelativePath } = routeApi.useParams();

  return (
    <DeleteGedObjectModalComponent
      type={FileType.CONTACT}
      id={enterpriseId}
      objectRelativePath={decodeURIComponent(objectRelativePath)}
      onClose={() =>
        navigate({
          from: routeApi.id,
          to: '../..',
          search: (old) => old,
          replace: true,
        })
      }
    />
  );
}
