import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { InternalNode, ReactFlowState, useStore as useFlowStore } from '@xyflow/react';
import classNames from 'classnames';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { ExpertStudyDensityCameraNode } from '../../../Flow/components/DensityCameraNode/DensityCameraNode';
import { ExpertStudyMonitorNode } from '../../../Flow/components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudyMiscProductNode } from '../../../Flow/components/MiscProductNode/MiscProductNode';
import { ExpertStudySynopticCameraNode } from '../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTransmitterNode } from '../../../Flow/components/TransmitterNode/TransmitterNode';
import useStateStore, { RFState } from '../../../Flow/utils/store';
import AppViewStudyViewExpertViewHeaderComponentCartComponentDensityTableComponent from './components/DensityTable/DensityTable';
import AppViewStudyViewExpertViewHeaderComponentCartComponentSynopticTableComponent from './components/SynopticTable/SynopticTable';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

const reactFlowSelector = (state: ReactFlowState) => {
  const nodes = Array.from(state.nodeLookup.values());
  const productNodes = nodes.filter(
    (
      node,
    ): node is InternalNode<
      | ExpertStudySynopticCameraNode
      | ExpertStudyDensityCameraNode
      | ExpertStudyMonitorNode
      | ExpertStudyRecorderNode
      | ExpertStudyTransmitterNode
      | ExpertStudyMiscProductNode
    > => !!node.type && ['synopticCamera', 'densityCamera', 'monitor', 'recorder', 'transmitter', 'misc-product'].includes(node.type),
  );
  const camerasCount = productNodes.reduce(
    (acc, node) => acc + (node.type === 'synopticCamera' ? (node.data.quantity ?? 1) : node.type === 'densityCamera' ? 1 : 0),
    0,
  );

  const productsCount = productNodes.reduce(
    (acc, node) =>
      (acc +=
        ('quantity' in node.data && node.data.quantity !== undefined ? node.data.quantity : 1) +
        ('options' in node.data ? node.data.options.reduce((acc, option) => acc + option.quantity, 0) : 0)),
    0,
  );

  return {
    productCount: productsCount,
    cameraCount: camerasCount,
  };
};

const stateSelector = (state: RFState) => ({
  pageName: state.pages[state.currentPage].name ?? `Page ${state.currentPage + 1}`,
  pageType: state.pages[state.currentPage].type,
});

export default function AppViewStudyViewExpertViewHeaderComponentCartComponent() {
  const { productCount, cameraCount } = useFlowStore(useShallow(reactFlowSelector));
  const { pageName, pageType } = useStateStore(useShallow(stateSelector));

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[2.5rem] w-36 items-center justify-center space-x-1 rounded-md border border-slate-800 px-4 py-2 text-sm shadow-xs hover:outline hover:outline-offset-[1px] hover:outline-blue-500"
      >
        Étude {productCount} {productCount > 1 ? 'articles' : 'article'}
      </button>
      <div
        className={classNames(
          'absolute right-0 z-500 h-full bg-slate-100 text-white shadow-md backdrop-blur-sm transition-all duration-300 ease-in',
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[200%] opacity-0',
        )}
      >
        <div className="h-full w-[40rem] overflow-y-auto overflow-x-hidden pb-4">
          <div className="mt-8 flex h-full flex-col">
            <div className="">
              <p className="pl-6 text-black">
                Numéro de dossier: {business.numBusiness} ({pageName}) ({`${cameraCount} ${cameraCount > 1 ? 'caméras' : 'caméra'}`})
              </p>

              <button type="button" onClick={() => setIsOpen(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="stoke-indigo-900 fixed right-4 top-0 z-900 h-12 w-12 fill-indigo-900"
                >
                  <path stroke="white" strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {isOpen &&
                (() => {
                  switch (pageType) {
                    case 'synoptic':
                      return <AppViewStudyViewExpertViewHeaderComponentCartComponentSynopticTableComponent />;
                    case 'density':
                      return <AppViewStudyViewExpertViewHeaderComponentCartComponentDensityTableComponent />;
                  }
                })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
