import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateGedDirectoryModalComponent from '../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises/$enterpriseId/create-ged-directory');

export default function AppRouteAppEnterpriseViewCreateGedDirectoryModalView() {
  const navigate = useNavigate();

  const { enterpriseId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <CreateGedDirectoryModalComponent
      type={FileType.CONTACT}
      id={enterpriseId}
      directoryRelativePath={gedObjectRelativePath}
      onClose={() =>
        navigate({
          from: routeApi.id,
          to: '..',
          search: (old) => ({ ...old, gedObjectRelativePath: undefined }),
          replace: true,
          resetScroll: false,
        })
      }
    />
  );
}
