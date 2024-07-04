import { useMemo, useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import AppViewStudyViewExpertViewFlowComponent from './components/Flow/Flow';
import AppViewStudyViewExpertViewHeaderComponent from './components/Header/Header';
import AppViewStudyViewExpertViewModalProviderComponent from './components/ModalProvider/ModalProvider';
import AppViewStudyViewExpertViewProductsMenuComponent from './components/ProductsMenu/ProductsMenu';
import ExpertStudyContext, { ExpertStudyModal, ExpertStudyPaneClickFunction } from './utils/context';

export default function AppViewStudyViewExpertView() {
  const [modal, setModal] = useState<ExpertStudyModal>();
  const [paneClickFunction, setPaneClickFunction] = useState<ExpertStudyPaneClickFunction>();

  const contextValue = useMemo(
    () => ({ modal, setModal, paneClickFunction, setPaneClickFunction }),
    [modal, setModal, paneClickFunction, setPaneClickFunction],
  );

  return (
    <ExpertStudyContext.Provider value={contextValue}>
      <ReactFlowProvider>
        <div className="flex flex-row gap-x-4">
          <AppViewStudyViewExpertViewProductsMenuComponent />
          <div className="flex h-screen w-screen flex-col">
            <AppViewStudyViewExpertViewHeaderComponent />
            <AppViewStudyViewExpertViewFlowComponent />
          </div>
        </div>
        <AppViewStudyViewExpertViewModalProviderComponent />
      </ReactFlowProvider>
    </ExpertStudyContext.Provider>
  );
}
