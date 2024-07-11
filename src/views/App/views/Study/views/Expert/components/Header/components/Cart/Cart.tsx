import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { InternalNode, ReactFlowState, useStore as useFlowStore } from '@xyflow/react';
import classNames from 'classnames';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { ExpertStudyMonitorNode } from '../../../Flow/components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudySynopticCameraNode } from '../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTransmitterNode } from '../../../Flow/components/TransmitterNode/TransmitterNode';
import useStateStore, { RFState } from '../../../Flow/utils/store';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import AppViewStudyViewExpertViewHeaderComponentCartComponentSynopticTableComponent from './components/SynopticTable/SynopticTable';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study/expert');

const reactFlowSelector = (state: ReactFlowState) => {
  const nodes = Array.from(state.nodeLookup.values());

  const productNodes = nodes.filter(
    (node): node is InternalNode<ExpertStudySynopticCameraNode | ExpertStudyMonitorNode | ExpertStudyRecorderNode | ExpertStudyTransmitterNode> =>
      !!node.type && ['synopticCamera', 'monitor', 'recorder', 'transmitter'].includes(node.type),
  );

  const products: Array<{ id: string; quantity: number }> = [];
  for (const node of productNodes) {
    const product = products.find((p) => p.id === node.data.productId);
    if (!!product) product.quantity++;
    else products.push({ id: node.data.productId, quantity: 1 });
    for (const option of node.data.options) {
      const product = products.find((p) => p.id === option.id);
      if (!!product) product.quantity += option.quantity;
      else products.push({ id: option.id, quantity: option.quantity });
    }
  }
  return { productsData: products, camerasCount: nodes.filter((node) => node.type === 'synopticCamera').length };
};

const stateSelector = (state: RFState) => ({ pageName: state.pages[state.currentPage].name ?? `Page ${state.currentPage + 1}` });

export default function AppViewStudyViewExpertViewHeaderComponentCartComponent() {
  const { productsData, camerasCount } = useFlowStore(reactFlowSelector, (a, b) => _.isEqual(a, b));
  const { pageName } = useStateStore(useShallow(stateSelector));

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: products } = useSuspenseQuery(queries.product.list);

  const [isOpen, setIsOpen] = useState(false);

  const data = useMemo(
    () =>
      productsData
        .map((productData) => ({ product: products.find((product) => product.id === productData.id), quantity: productData.quantity }))
        .filter((productData): productData is { product: ProductResponseDto; quantity: number } => !!productData.product),
    [productsData, products],
  );

  const totalProductsQuantity = productsData.reduce((acc, product) => acc + product.quantity, 0);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[2.5rem] w-36 items-center justify-center space-x-1 rounded-md border border-slate-800 px-4 py-2 text-sm shadow-sm hover:outline hover:outline-offset-[1px] hover:outline-blue-500"
      >
        Étude {totalProductsQuantity} {totalProductsQuantity > 1 ? 'articles' : 'article'}
      </button>
      <div
        className={classNames(
          'absolute right-0 z-[500] h-full bg-slate-100 text-white shadow-md backdrop-blur transition-all duration-300 ease-in',
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[200%] opacity-0',
        )}
      >
        <div className="h-full w-[40rem] overflow-y-auto overflow-x-hidden pb-4">
          <div className="mt-8 flex h-full flex-col ">
            <div className="">
              <p className="pl-6 text-black">
                Numéro de dossier: {business.numBusiness} ({pageName}) ({`${camerasCount} ${camerasCount > 1 ? 'caméras' : 'caméra'}`})
              </p>

              <button type="button" onClick={() => setIsOpen(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="stoke-indigo-900 fixed right-4 top-0 z-[900] h-12 w-12 fill-indigo-900"
                >
                  <path stroke="white" strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <AppViewStudyViewExpertViewHeaderComponentCartComponentSynopticTableComponent data={data} />
              {/* {pageMode === 'DENSITY' ? <DensityPanier /> : <SynopticPanier />} // TODO: reimplement this */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
