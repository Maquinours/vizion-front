import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';
import { useContext } from 'react';
import { TabsContext } from '../../../../components/TabsContainer/utils/contexts/context';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId');

export default function AppViewBusinessViewBeforeCloseModalComponent() {
  const navigate = useNavigate({ from: routeApi.id });

  const { removeTab } = useContext(TabsContext)!;

  const { businessId } = routeApi.useParams();
  const { businessModal } = routeApi.useSearch();

  const onClose = () => {
    navigate({ search: (old) => ({ ...old, businessModal: undefined }), replace: true, resetScroll: false });
  };

  const onCreated = () => {
    removeTab();
  };

  return (
    <CreateLifesheetModalComponent
      isOpen={businessModal === 'before-close'}
      associatedItemType={LifesheetAssociatedItem.BUSINESS}
      associatedItemId={businessId}
      subtitle="Ajouter un commentaire avant de quitter"
      onClose={onClose}
      onCreated={onCreated}
    />
  );
}
