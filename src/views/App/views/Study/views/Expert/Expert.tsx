import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { ReactFlowProvider } from '@xyflow/react';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { synopticBusinessQueryKeys } from '../../../../../../utils/constants/queryKeys/synoptic';
import AppViewStudyViewExpertViewFirstPageTypeSelectionComponent from './components/FirstPageTypeSelection/FirstPageTypeSelection';
import AppViewStudyViewExpertViewFlowComponent from './components/Flow/Flow';
import useStore, { RFState } from './components/Flow/utils/store';
import AppViewStudyViewExpertViewFooterComponent from './components/Footer/Footer';
import AppViewStudyViewExpertViewHeaderComponent from './components/Header/Header';
import AppViewStudyViewExpertViewModalProviderComponent from './components/ModalProvider/ModalProvider';
import AppViewStudyViewExpertViewProductsMenuComponent from './components/ProductsMenu/ProductsMenu';
import ExpertStudyContext, { ExpertStudyModal, ExpertStudyPaneClickFunction } from './utils/context';
import { parseStudy } from './utils/functions/parse';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

const selector = (state: RFState) => ({
  hasPage: state.pages.length > 0,
  getBusinessId: state.getBusinessId,
  setBusinessId: state.setBusinessId,
  reset: state.reset,
  importStudy: state.importStudy,
});

export default function AppViewStudyViewExpertView() {
  const { hasPage, getBusinessId, setBusinessId, reset, importStudy } = useStore(useShallow(selector));

  const { businessId } = routeApi.useParams();

  const { data: synoptic } = useSuspenseQuery(synopticBusinessQueryKeys.detail._ctx.byBusinessId(businessId));

  const [modal, setModal] = useState<ExpertStudyModal>();
  const [paneClickFunction, setPaneClickFunction] = useState<ExpertStudyPaneClickFunction>();

  const contextValue = useMemo(
    () => ({ modal, setModal, paneClickFunction, setPaneClickFunction }),
    [modal, setModal, paneClickFunction, setPaneClickFunction],
  );

  useEffect(() => {
    if (getBusinessId() !== businessId) {
      if (!!synoptic?.synopticList) {
        parseStudy(synoptic.synopticList).then((study) => {
          importStudy(study);
        });
      } else {
        reset();
      }
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
            <div className="max-h-[calc(100%-48px)]">
              <div id="flow-parent" className="flex aspect-[1096/775] h-full items-center justify-center border-r border-r-slate-800">
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
