import { getRouteApi } from '@tanstack/react-router';
import DeleteGedObjectModalComponent from '../../../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/faq/ged/$faqId/delete/$itemRelativePath');

export default function AppViewFaqViewGedModalViewDeleteModalView() {
  const navigate = routeApi.useNavigate();

  const { faqId, itemRelativePath } = routeApi.useParams();

  return (
    <DeleteGedObjectModalComponent
      type={FileType.FAQ}
      id={faqId}
      objectRelativePath={itemRelativePath}
      onClose={() => navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false })}
    />
  );
}
