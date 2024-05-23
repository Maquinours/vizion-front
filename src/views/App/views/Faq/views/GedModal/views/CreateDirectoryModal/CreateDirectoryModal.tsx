import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateGedDirectoryModalComponent from '../../../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/faq/ged/$faqId/create-directory');
export default function AppViewFaqViewGedModalViewCreateDirectoryModalView() {
  const navigate = useNavigate();

  const { faqId } = routeApi.useParams();
  const { relativePath } = routeApi.useSearch();

  return (
    <CreateGedDirectoryModalComponent
      type={FileType.FAQ}
      id={faqId}
      directoryRelativePath={relativePath ?? ''}
      onClose={() => navigate({ from: routeApi.id, to: '..', search: (old) => old, replace: true })}
    />
  );
}
