import { getRouteApi, useNavigate } from '@tanstack/react-router';
import RenameGedObjectModalComponent from '../../../../../../components/RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/enterprises/$enterpriseId/rename-ged-object/$objectRelativePath');

export default function AppViewEnterpriseViewRenameGedObjectModalView() {
  const navigate = useNavigate();

  const { enterpriseId, objectRelativePath } = routeApi.useParams();

  return (
    <RenameGedObjectModalComponent
      type={FileType.CONTACT}
      id={enterpriseId}
      objectRelativePath={decodeURIComponent(objectRelativePath)}
      onClose={() =>
        navigate({
          from: routeApi.id,
          to: '../..',
          search: ({ allBusinessPage, contactsSearch, contactsPage, lifesheetPage }) => ({ allBusinessPage, contactsSearch, contactsPage, lifesheetPage }),
        })
      }
    />
  );
}
