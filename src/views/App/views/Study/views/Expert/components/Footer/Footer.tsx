import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import useStore, { RFState } from '../Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';

const selector = (state: RFState) => ({
  currentPage: state.currentPage,
  pages: state.pages,
  setCurrentPage: state.setCurrentPage,
  addPage: state.addPage,
});

export default function AppViewStudyViewExpertViewFooterComponent() {
  const { currentPage, pages, setCurrentPage, addPage } = useStore(useShallow(selector));

  return (
    <div className="flex w-full items-center justify-center  py-2 ">
      <div className="flex w-[75%] items-center justify-between space-x-2 pl-4 ">
        {/* <div className="flex items-center justify-center space-x-2 ">
          <button className="rounded-md border border-indigo-800 p-2 text-indigo-800 hover:bg-[#31385A] hover:text-white" onClick={onHddCalcCommentButtonClick}>
            Commentaire de calcul de disque
          </button>
        </div> */}

        <PaginationComponent page={currentPage} totalPages={pages.length} onPageChange={setCurrentPage} />
        <button type="button" className="btn btn-primary" onClick={addPage}>
          Ajouter une page
        </button>
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
    </div>
  );
}
