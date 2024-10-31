import { getRouteApi } from '@tanstack/react-router';
import GedComponent from '../../../../../../../../components/Ged/Ged';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');

export default function AppViewBusinessViewDashboardViewGedComponent() {
  const { businessId } = routeApi.useParams();

  return (
    <GedComponent
      type={FileType.AFFAIRE}
      id={businessId}
      getCreateDirectoryLink={(data) => ({
        to: '/app/businesses-rma/business/$businessId/dashboard/create-ged-directory',
        search: (old) => ({ ...old, relativePath: data?.relativePath ?? '' }),
        replace: true,
        resetScroll: false,
        ignoreBlocker: true,
      })}
      getImportFilesLink={(data) => ({
        to: '/app/businesses-rma/business/$businessId/dashboard/import-ged-files',
        search: (old) => ({ ...old, relativePath: data?.relativePath ?? '' }),
        replace: true,
        resetScroll: false,
        ignoreBlocker: true,
      })}
      getRenameLink={(data) => ({
        to: '/app/businesses-rma/business/$businessId/dashboard/rename-ged-object/$objectRelativePath',
        params: { objectRelativePath: data.relativePath },
        search: (old) => old,
        replace: true,
        resetScroll: false,
        ignoreBlocker: true,
      })}
      getDeleteLink={(data) => ({
        to: '/app/businesses-rma/business/$businessId/dashboard/delete-ged-object/$objectRelativePath',
        params: { objectRelativePath: data.relativePath },
        search: (old) => old,
        replace: true,
        resetScroll: false,
        ignoreBlocker: true,
      })}
    />
  );
}
