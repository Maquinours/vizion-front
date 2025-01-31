// import { useSuspenseQuery } from '@tanstack/react-query';
// import { getRouteApi } from '@tanstack/react-router';
// import ReactModal from 'react-modal';
// import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
// import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

// export default function AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageRecapStepComponent() {
//   const { businessId } = routeApi.useParams();

//   const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
//   const { data: enterprise } = useSuspenseQuery(queries.enterprise.detail(business.enterpriseId));

//   return (
//     <ReactModal
//       isOpen
//       onRequestClose={onClose}
//       className="absolute top-2/4 left-2/4 m-auto h-auto w-auto min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
//       overlayClassName="Overlay"
//     >
//       <div className="w-full rounded-md bg-white pb-2">
//         <div className="flex flex-col gap-y-4 p-4">
//           <div>
//             <span>Entreprise : </span>
//             <span>{enterprise.name}</span>
//           </div>
//           <div>
//             <span>Catégorie : </span>
//             <span>{enterprise.category}</span>
//           </div>
//           <div>
//             <span>Remise : </span>
//             <AmountFormat value={enterprise.accountability?.discount} suffix='%' />
//           </div>
//         </div>

//         <div className="flex items-center justify-center space-x-2">
//           <button type="button" onClick={onClose} className="btn btn-secondary">
//             Annuler
//           </button>
//           <button type="button" onClick={onConfirm} className="btn btn-primary">
//             Continuer
//           </button>
//         </div>
//       </div>
//     </ReactModal>
//   );
// }
