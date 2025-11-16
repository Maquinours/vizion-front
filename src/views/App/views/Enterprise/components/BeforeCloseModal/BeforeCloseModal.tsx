import { useContext } from 'react';
import CreateLifesheetModalComponent from '../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { TabsContext } from '../../../../components/TabsContainer/utils/contexts/context';
import { getRouteApi } from '@tanstack/react-router';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');

export default function AppViewEnterpriseViewBeforeCloseModalComponent() {
  const navigate = routeApi.useNavigate();

  const { removeTab } = useContext(TabsContext)!;

  const { enterpriseId } = routeApi.useParams();

  const onCreated = () => {
    removeTab();
  };

  const onClose = () => {
    navigate({ search: (old) => ({ ...old, enterpriseModal: undefined }), replace: true, resetScroll: false });
  };

  return (
    <CreateLifesheetModalComponent
      isOpen
      associatedItemType={LifesheetAssociatedItem.ENTERPRISE}
      associatedItemId={enterpriseId}
      subtitle="Ajouter un commentaire avant de quitter"
      onCreated={onCreated}
      onClose={onClose}
    />
  );
}
