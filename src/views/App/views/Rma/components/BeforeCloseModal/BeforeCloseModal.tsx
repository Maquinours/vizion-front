import { useContext } from 'react';
import CreateLifesheetModalComponent from '../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { TabsContext } from '../../../../components/TabsContainer/utils/contexts/context';
import { getRouteApi } from '@tanstack/react-router';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId');

export default function AppViewRmaViewBeforeCloseModalView() {
  const navigate = routeApi.useNavigate();

  const { removeTab } = useContext(TabsContext)!;

  const { rmaId } = routeApi.useParams();

  const onCreated = () => {
    removeTab();
  };

  const onClose = () => {
    navigate({ search: (old) => ({ ...old, rmaModal: undefined }), replace: true, resetScroll: false });
  };

  return (
    <CreateLifesheetModalComponent
      isOpen
      associatedItemType={LifesheetAssociatedItem.RMA}
      associatedItemId={rmaId}
      subtitle="Ajouter un commentaire avant de quitter"
      onCreated={onCreated}
      onClose={onClose}
    />
  );
}
