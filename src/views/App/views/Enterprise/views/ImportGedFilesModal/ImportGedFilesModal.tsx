import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ImportGedFilesModalComponent from '../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises/$enterpriseId/import-ged-files');

export default function AppViewEnterpriseViewImportGedFilesModalView() {
  const navigate = useNavigate();

  const { enterpriseId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <ImportGedFilesModalComponent
      type={FileType.CONTACT}
      id={enterpriseId}
      directoryRelativePath={gedObjectRelativePath}
      onClose={() =>
        navigate({
          from: routeApi.id,
          to: '..',
          search: (old) => ({ ...old, gedObjectRelativePath: undefined }),
        })
      }
    />
  );
}
