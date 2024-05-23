import { getRouteApi } from '@tanstack/react-router';
import GedComponent from '../../../../../../components/Ged/Ged';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises/$enterpriseId');

export default function AppViewEnterpriseViewGedComponent() {
  const { enterpriseId } = routeApi.useParams();

  return (
    <GedComponent
      type={FileType.CONTACT}
      id={enterpriseId}
      getCreateDirectoryLink={(data) => ({
        from: routeApi.id,
        to: '/app/enterprises/$enterpriseId/create-ged-directory',
        search: (old) => ({ ...old, gedObjectRelativePath: data?.relativePath ?? '' }),
        params: (old) => old,
        replace: true,
      })}
      getImportFilesLink={(data) => ({
        from: routeApi.id,
        to: '/app/enterprises/$enterpriseId/import-ged-files',
        search: (old) => ({
          ...old,
          gedObjectRelativePath: data?.relativePath ?? '',
        }),
        params: (old) => old,
        replace: true,
      })}
      getDeleteLink={(data) => ({
        from: routeApi.id,
        to: '/app/enterprises/$enterpriseId/delete-ged-object/$objectRelativePath',
        search: (old) => old,
        params: (old) => ({
          ...old,
          objectRelativePath: encodeURIComponent(data.relativePath),
        }),
        replace: true,
      })}
      getRenameLink={(data) => ({
        from: routeApi.id,
        to: '/app/enterprises/$enterpriseId/rename-ged-object/$objectRelativePath',
        search: (old) => old,
        params: (old) => ({ ...old, objectRelativePath: encodeURIComponent(data.relativePath) }),
        replace: true,
      })}
    />
  );
}
