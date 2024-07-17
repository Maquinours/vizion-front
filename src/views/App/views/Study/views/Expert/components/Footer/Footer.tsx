import { useShallow } from 'zustand/react/shallow';
import useStore, { RFState } from '../Flow/utils/store';
import AppViewStudyViewExpertViewFooterComponentPaginationComponent from './components/Pagination/Pagination';

const selector = (state: RFState) => ({
  currentPage: state.currentPage,
  hasPage: state.pages.length > 0,
  setCurrentPage: state.setCurrentPage,
  addPage: state.addPage,
  removePage: state.removePage,
});

export default function AppViewStudyViewExpertViewFooterComponent() {
  const { hasPage, addPage, removePage } = useStore(useShallow(selector));

  return (
    <div className="flex w-full items-center justify-center border-t border-t-slate-800 py-2">
      {hasPage && (
        <div className="flex w-[75%] items-center justify-between space-x-2 pl-4 ">
          {/* <div className="flex items-center justify-center space-x-2 ">
          <button className="rounded-md border border-indigo-800 p-2 text-indigo-800 hover:bg-[#31385A] hover:text-white" onClick={onHddCalcCommentButtonClick}>
            Commentaire de calcul de disque
          </button>
        </div> */}

          <AppViewStudyViewExpertViewFooterComponentPaginationComponent />
          <div className="flex items-center justify-center gap-x-2">
            <button type="button" className="btn btn-primary" onClick={removePage}>
              Supprimer la page
            </button>
            <button type="button" className="btn btn-primary" onClick={() => addPage('synoptic')}>
              Ajouter une synoptique
            </button>
            <button type="button" className="btn btn-primary" onClick={() => addPage('density')}>
              Ajouter une densité
            </button>
          </div>
          {/* <div className="flex items-center justify-center space-x-2">
          {hasBackground && !pdfRender && (
            <button
              id="btn_delete_background"
              onClick={deleteBackgroundCallback}
              className="relative rounded-md border border-indigo-800 p-2 text-indigo-800 hover:bg-red-500 hover:text-white"
            >
              Supprimer le plan
            </button>
          )}
          <button onClick={deletePageCallback} className="relative rounded-md border border-indigo-800 p-2 text-indigo-800 hover:bg-red-500 hover:text-white">
            Supprimer cette page
          </button>
          <button onClick={addSynopticPage} className="rounded-md border border-indigo-800 p-2 text-indigo-800 hover:bg-[#31385A] hover:text-white">
            Ajouter une synoptique
          </button>
          <button onClick={addDensityPage} className="rounded-md border border-indigo-800 p-2 text-indigo-800 hover:bg-[#31385A] hover:text-white">
            Ajouter une densité
          </button>
        </div> */}
        </div>
      )}
    </div>
  );
}
