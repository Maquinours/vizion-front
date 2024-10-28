import { useShallow } from 'zustand/react/shallow';
import useStore, { RFState } from '../Flow/utils/store';
import AppViewStudyViewExpertViewFooterComponentPaginationComponent from './components/Pagination/Pagination';
import AppViewStudyViewExpertViewFooterComponentColorsMenuComponent from './components/ColorsMenu/ColorsMenu';

const selector = (state: RFState) => ({
  hasPage: state.pages.length > 0,
  addPage: state.addPage,
  removePage: state.removePage,
  pageType: state.pages.at(state.currentPage)?.type,
});

export default function AppViewStudyViewExpertViewFooterComponent() {
  const { hasPage, addPage, removePage, pageType } = useStore(useShallow(selector));

  return (
    <div className="flex w-full items-center justify-center border-t border-t-slate-800 py-2">
      {hasPage && (
        <div className="flex w-[75%] items-center justify-between space-x-2 pl-4">
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
            {pageType === 'density' && <AppViewStudyViewExpertViewFooterComponentColorsMenuComponent />}
          </div>
        </div>
      )}
    </div>
  );
}
