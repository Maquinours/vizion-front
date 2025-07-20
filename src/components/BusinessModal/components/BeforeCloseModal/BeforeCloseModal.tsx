// import { getRouteApi } from '@tanstack/react-router';
// import { useContext } from 'react';
// import { TabsContext } from '../../../../views/App/components/TabsContainer/utils/contexts/context';
// import CreateLifesheetModalComponent from '../../../CreateLifesheetModal/CreateLifesheetModal';
// import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId');

// export default function AppViewBusinessViewBeforeCloseModalComponent() {
//   const navigate = routeApi.useNavigate();

//   const { removeTab } = useContext(TabsContext)!;

//   const { businessId } = routeApi.useParams();
//   const { businessModal } = routeApi.useSearch();

//   const onClose = () => {
//     navigate({ search: (old) => ({ ...old, businessModal: undefined }), replace: true, resetScroll: false });
//   };

//   const onCreated = () => {
//     removeTab();
//   };

//   return (
//     <CreateLifesheetModalComponent
//       isOpen={businessModal === 'before-close'}
//       associatedItemType={LifesheetAssociatedItem.BUSINESS}
//       associatedItemId={businessId}
//       subtitle="Ajouter un commentaire avant de quitter"
//       onClose={onClose}
//       onCreated={onCreated}
//     />
//   );
// }
