import { getRouteApi } from '@tanstack/react-router';
import GedComponent from '../../../Ged/Ged';
import FileType from '../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');
const routePath = '/app/enterprises/$enterpriseId';

export default function AppViewEnterpriseViewGedComponent() {
  const { enterpriseId } = routeApi.useParams();

  return (
    <GedComponent
      type={FileType.CONTACT}
      id={enterpriseId}
      getCreateDirectoryLink={(data) => ({
        from: routePath,
        to: '/app/enterprises/$enterpriseId/create-ged-directory',
        search: (old) => ({ ...old, gedObjectRelativePath: data?.relativePath ?? '' }),
        replace: true,
        resetScroll: false,
      })}
      getImportFilesLink={(data) => ({
        from: routePath,
        to: '/app/enterprises/$enterpriseId/import-ged-files',
        search: (old) => ({
          ...old,
          gedObjectRelativePath: data?.relativePath ?? '',
        }),
        replace: true,
        resetScroll: false,
      })}
      getDeleteLink={(data) => ({
        from: routePath,
        to: '/app/enterprises/$enterpriseId/delete-ged-object/$objectRelativePath',
        search: true,
        params: (old) => ({
          ...old,
          objectRelativePath: encodeURIComponent(data.relativePath),
        }),
        replace: true,
        resetScroll: false,
      })}
      getRenameLink={(data) => ({
        from: routePath,
        to: '/app/enterprises/$enterpriseId/rename-ged-object/$objectRelativePath',
        search: true,
        params: (old) => ({ ...old, objectRelativePath: encodeURIComponent(data.relativePath) }),
        replace: true,
        resetScroll: false,
      })}
    />
  );
}
