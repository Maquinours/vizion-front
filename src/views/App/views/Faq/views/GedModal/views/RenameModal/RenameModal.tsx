import { getRouteApi, useNavigate } from '@tanstack/react-router';
import RenameGedObjectModalComponent from '../../../../../../../../components/RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/faq/ged/$faqId/rename/$itemRelativePath');

export default function AppViewFaqViewGedModalViewRenameModalView() {
  const navigate = useNavigate();

  const { faqId, itemRelativePath } = routeApi.useParams();

  return (
    <RenameGedObjectModalComponent
      type={FileType.FAQ}
      id={faqId}
      objectRelativePath={itemRelativePath}
      onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old })}
    />
  );
}
