import { useEffect, useMemo, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import AppViewStudyViewExpertViewFlowComponent from './components/Flow/Flow';
import AppViewStudyViewExpertViewHeaderComponent from './components/Header/Header';
import AppViewStudyViewExpertViewModalProviderComponent from './components/ModalProvider/ModalProvider';
import AppViewStudyViewExpertViewProductsMenuComponent from './components/ProductsMenu/ProductsMenu';
import ExpertStudyContext, { ExpertStudyModal, ExpertStudyPaneClickFunction } from './utils/context';
import AppViewStudyViewExpertViewFooterComponent from './components/Footer/Footer';
import useStore, { RFState } from './components/Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';
import AppViewStudyViewExpertViewFirstPageTypeSelectionComponent from './components/FirstPageTypeSelection/FirstPageTypeSelection';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study/expert');

const selector = (state: RFState) => ({
  hasPage: state.pages.length > 0,
  getBusinessId: state.getBusinessId,
  setBusinessId: state.setBusinessId,
  reset: state.reset,
});

export default function AppViewStudyViewExpertView() {
  const { hasPage, getBusinessId, setBusinessId, reset } = useStore(useShallow(selector));

  const { businessId } = routeApi.useParams();

  const [modal, setModal] = useState<ExpertStudyModal>();
  const [paneClickFunction, setPaneClickFunction] = useState<ExpertStudyPaneClickFunction>();

  const contextValue = useMemo(
    () => ({ modal, setModal, paneClickFunction, setPaneClickFunction }),
    [modal, setModal, paneClickFunction, setPaneClickFunction],
  );

  useEffect(() => {
    if (getBusinessId() !== businessId) {
      reset();
      setBusinessId(businessId);
    }
  }, [businessId]);

  return (
    <ExpertStudyContext.Provider value={contextValue}>
      <ReactFlowProvider>
        <div className="flex h-[80vh] w-full flex-row">
          <AppViewStudyViewExpertViewProductsMenuComponent />
          <div className="flex h-full w-full flex-col">
            <AppViewStudyViewExpertViewHeaderComponent />
            <div className="h-[calc(100%-48px)]">
              <div className="flex aspect-[1096/775] h-full items-center justify-center border-r border-r-slate-800">
                {hasPage ? <AppViewStudyViewExpertViewFlowComponent /> : <AppViewStudyViewExpertViewFirstPageTypeSelectionComponent />}
              </div>
            </div>
            <AppViewStudyViewExpertViewFooterComponent />
          </div>
        </div>
        <AppViewStudyViewExpertViewModalProviderComponent />
      </ReactFlowProvider>
    </ExpertStudyContext.Provider>
  );
}
