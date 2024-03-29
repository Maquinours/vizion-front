import { getRouteApi, useNavigate } from '@tanstack/react-router';
import DeleteGedObjectModalComponent from '../../../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/faq/ged/$faqId/delete/$itemRelativePath');

export default function AppViewFaqViewGedModalViewDeleteModalView() {
  const navigate = useNavigate();

  const { faqId, itemRelativePath } = routeApi.useParams();

  return (
    <DeleteGedObjectModalComponent
      type={FileType.FAQ}
      id={faqId}
      objectRelativePath={itemRelativePath}
      onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old })}
    />
  );
}
