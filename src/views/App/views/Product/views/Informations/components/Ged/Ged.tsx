import { getRouteApi } from '@tanstack/react-router';
import GedComponent from '../../../../../../../../components/Ged/Ged';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/products/$productId/informations');
export default function AppViewProductViewInformationsViewGedComponent() {
  const { productId } = routeApi.useParams();

  return (
    <GedComponent
      type={FileType.PRODUIT}
      id={productId}
      getCreateDirectoryLink={(data) => ({
        to: '/app/products/$productId/informations/create-ged-directory',
        search: (old) => ({ ...old, gedObjectRelativePath: data?.relativePath ?? '' }),
        params: (old) => old,
      })}
      getImportFilesLink={(data) => ({
        to: '/app/products/$productId/informations/import-ged-files',
        search: (old) => ({ ...old, gedObjectRelativePath: data?.relativePath ?? '' }),
        params: (old) => old,
      })}
      getDeleteLink={(data) => ({
        to: '/app/products/$productId/informations/delete-ged-object',
        search: (old) => ({ ...old, gedObjectRelativePath: data?.relativePath ?? '' }),
        params: (old) => old,
      })}
      getRenameLink={(data) => ({
        to: '/app/products/$productId/informations/rename-ged-object',
        search: (old) => ({ ...old, gedObjectRelativePath: data?.relativePath ?? '' }),
        params: (old) => old,
      })}
    />
  );
}
