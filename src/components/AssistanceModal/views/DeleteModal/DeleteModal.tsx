// import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
// import { getRouteApi } from '@tanstack/react-router';
// import React, { useContext } from 'react';
// import ReactModal from 'react-modal';
// import { PulseLoader } from 'react-spinners';
// import { toast } from 'react-toastify';
// import { deleteTechnicalSupport } from '../../../../../../utils/api/technicalSupports';
// import { queries } from '../../../../../../utils/constants/queryKeys';
// import { TabsContext } from '../../../../components/TabsContainer/utils/contexts/context';
// import styles from './DeleteModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/delete');

// export default function AppViewAssistanceViewDeleteModalView() {
//   const queryClient = useQueryClient();
//   const navigate = routeApi.useNavigate();

//   const { removeTab } = useContext(TabsContext)!;

//   const { assistanceId } = routeApi.useParams();

//   const { data: assistance } = useSuspenseQuery(queries['technical-supports'].detail._ctx.byId(assistanceId));

//   const onClose = () => {
//     navigate({ to: '..', search: true, replace: true, resetScroll: false });
//   };

//   const { mutate, isPending } = useMutation({
//     mutationFn: () => deleteTechnicalSupport(assistance.id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queries['technical-supports']._def });
//       toast.success('Assistance supprimée avec succès');
//       removeTab();
//     },
//     onError: (error) => {
//       console.error(error);
//       toast.error("Une erreur est survenue lors de la suppression de l'assistance");
//     },
//   });

//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     mutate();
//   };

//   return (
//     <ReactModal isOpen={true} onRequestClose={onClose} overlayClassName="Overlay" className={styles.modal}>
//       <div className={styles.modal_container}>
//         <div className={styles.modal_title}>
//           <h6>
//             Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> {"l'assistance "}
//             <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{assistance.name}</span> ?
//           </h6>
//         </div>
//         <form onSubmit={onSubmit}>
//           <div className={styles.modal_content}>
//             <p>{"Cette action irréversible va supprimer l'assistance technique définitivement."}</p>
//           </div>

//           <div className={styles.modal_loader}>
//             <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
//           </div>

//           <div className={styles.modal_buttons}>
//             <button className="btn btn-primary-light" onClick={() => onClose()}>
//               Annuler
//             </button>
//             <button type="submit" disabled={isPending} className="btn btn-secondary">
//               Supprimer
//             </button>
//           </div>
//         </form>
//       </div>
//     </ReactModal>
//   );
// }
