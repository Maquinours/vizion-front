import { useNavigate } from '@tanstack/react-router';
import { getRouteApi } from '@tanstack/react-router';
import ImportGedFilesModalComponent from '../../../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/faq/ged/$faqId/import-files');

export default function AppViewFaqViewGedModalViewImportFilesModalView() {
  const navigate = useNavigate();

  const { faqId } = routeApi.useParams();
  const { relativePath } = routeApi.useSearch();

  return (
    <ImportGedFilesModalComponent
      type={FileType.FAQ}
      id={faqId}
      directoryRelativePath={relativePath ?? ''}
      onClose={() => navigate({ from: routeApi.id, to: '..', search: (old) => old, replace: true, resetScroll: false })}
    />
  );
}
