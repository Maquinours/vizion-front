import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewImportGedFilesModalView from '../../../../../views/App/views/Product/views/Informations/views/ImportGedFilesModal/ImportGedFilesModal';

export const Route = createLazyFileRoute('/app/products/$productId/informations/import-ged-files')({
  component: AppViewProductViewInformationsViewImportGedFilesModalView,
});
