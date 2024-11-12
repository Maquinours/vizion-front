import { getRouteApi } from '@tanstack/react-router';
import ImportGedFilesModalComponent from '../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/import-ged-files');

export default function AppViewEnterpriseViewImportGedFilesModalView() {
  const navigate = routeApi.useNavigate();

  const { enterpriseId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <ImportGedFilesModalComponent
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
