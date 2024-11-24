import { getRouteApi } from '@tanstack/react-router';
import CreateGedDirectoryModalComponent from '../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/create-ged-directory');

export default function AppRouteAppEnterpriseViewCreateGedDirectoryModalView() {
  const navigate = routeApi.useNavigate();

  const { enterpriseId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <CreateGedDirectoryModalComponent
      type={FileType.CONTACT}
      id={enterpriseId}
      directoryRelativePath={gedObjectRelativePath}
      onClose={() =>
        navigate({
          to: '..',
          search: (old) => ({ ...old, gedObjectRelativePath: undefined }),
          replace: true,
          resetScroll: false,
        })
      }
    />
  );
}
