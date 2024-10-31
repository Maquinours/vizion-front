import { useContext } from 'react';
import CreateLifesheetModalComponent from '../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { TabsContext } from '../../../../components/TabsContainer/utils/contexts/context';
import { getRouteApi } from '@tanstack/react-router';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId');

export default function AppViewAssistanceViewBeforeCloseModalView() {
  const navigate = routeApi.useNavigate();

  const { removeTab } = useContext(TabsContext)!;

  const { assistanceId } = routeApi.useParams();

  const onCreated = () => {
    removeTab();
  };

  const onClose = () => {
    navigate({ search: (old) => ({ ...old, assistanceModal: undefined }), replace: true, resetScroll: false });
  };

  return (
    <CreateLifesheetModalComponent
      isOpen
      associatedItemType={LifesheetAssociatedItem.ASSISTANCE}
      associatedItemId={assistanceId}
      subtitle="Ajouter un commentaire avant de quitter"
      onCreated={onCreated}
      onClose={onClose}
    />
  );
}
