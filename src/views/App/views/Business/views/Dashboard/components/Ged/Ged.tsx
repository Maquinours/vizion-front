import { getRouteApi } from '@tanstack/react-router';
import GedComponent from '../../../../../../../../components/Ged/Ged';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

export default function AppViewBusinessViewDashboardViewGedComponent() {
  const { businessId } = routeApi.useParams();

  return (
    <GedComponent
      type={FileType.AFFAIRE}
      id={businessId}
      getCreateDirectoryLink={(data) => ({
        from: routeApi.id,
        to: 'app/enterprises/$enterpriseId/create-ged-directory',
        search: (old) => ({ ...old, relativePath: data?.relativePath ?? '' }),
        replace: true,
      })}
      getImportFilesLink={(data) => ({
        from: routeApi.id,
        to: 'app/enterprises/$enterpriseId/import-ged-files',
        search: (old) => ({ ...old, relativePath: data?.relativePath ?? '' }),
        replace: true,
      })}
      getRenameLink={(data) => ({
        from: routeApi.id,
        to: 'app/enterprises/$enterpriseId/rename-ged-object/$objectRelativePath',
        params: { objectRelativePath: data.relativePath },
        search: (old) => old,
        replace: true,
      })}
      getDeleteLink={(data) => ({
        from: routeApi.id,
        to: 'app/enterprises/$enterpriseId/delete-ged-object/$objectRelativePath',
        params: { objectRelativePath: data.relativePath },
        search: (old) => old,
        replace: true,
      })}
    />
  );
}
