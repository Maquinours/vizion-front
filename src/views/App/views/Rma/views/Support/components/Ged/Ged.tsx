import { getRouteApi } from '@tanstack/react-router';
import GedComponent from '../../../../../../../../components/Ged/Ged';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support');

export default function AppViewRmaViewSupportViewGedComponent() {
  const { rmaId } = routeApi.useParams();

  return (
    <GedComponent
      type={FileType.SAV}
      id={rmaId}
      getCreateDirectoryLink={(object) => ({
        to: '/app/businesses-rma/rma/$rmaId/support/create-ged-directory',
        search: (old) => ({ ...old, relativePath: object?.relativePath }),
        replace: true,
        resetScroll: false,
      })}
      getImportFilesLink={(object) => ({
        to: '/app/businesses-rma/rma/$rmaId/support/import-ged-files',
        search: (old) => ({ ...old, relativePath: object?.relativePath }),
        replace: true,
        resetScroll: false,
      })}
      getRenameLink={(object) => ({
        to: '/app/businesses-rma/rma/$rmaId/support/rename-ged-object/$objectRelativePath',
        params: { objectRelativePath: object.relativePath },
        search: true,
        replace: true,
        resetScroll: false,
      })}
      getDeleteLink={(object) => ({
        to: '/app/businesses-rma/rma/$rmaId/support/delete-ged-object/$relativePath',
        params: { objectRelativePath: object.relativePath },
        search: true,
        replace: true,
        resetScroll: false,
      })}
    />
  );
}
