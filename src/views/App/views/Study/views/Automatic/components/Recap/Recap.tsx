import { useQuery } from '@tanstack/react-query';
import { InternalNode, ReactFlowState, useStore } from '@xyflow/react';
import _ from 'lodash';
import { useMemo } from 'react';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import { AutomaticStudyFinalCameraNode } from '../Flow/components/FinalCameraNode/FinalCameraNode';

const getElements = (state: ReactFlowState, products: Array<ProductResponseDto> | undefined) => {
  const result: Array<{ reference: string; id: string; price: number; quantity: number }> = [];

  if (!products) return result;

  const camNodes = Array.from(state.nodeLookup.values()).filter((node): node is InternalNode<AutomaticStudyFinalCameraNode> => node.type === 'finalNode');

  for (const node of camNodes) {
    const element = result.find((element) => element.reference === node.data.model.reference);
    if (element) element.quantity++;
    else {
      const product = products.find((product) => product.reference === node.data.model.reference);
      if (!!product && !!product.reference && !!product.publicPrice)
        result.push({ reference: product.reference, id: product.id, price: product.publicPrice, quantity: 1 });
    }
    for (const option of node.data.options) {
      const optElement = result.find((element) => element.reference === option.reference);
      if (optElement) optElement.quantity += option.qty;
      else {
        const optProduct = products.find((product) => product.reference === option.reference);
        if (!!optProduct && !!optProduct.reference && !!optProduct.publicPrice)
          result.push({ reference: optProduct.reference, id: optProduct.id, price: optProduct.publicPrice, quantity: option.qty });
      }
    }
  }
  result.sort((a, b) => a.reference.localeCompare(b.reference, 'fr', { sensitivity: 'base' }));
  return result;
};

export default function AppViewStudyViewAutomaticViewRecapComponent() {
  const { data: products } = useQuery({ ...queries.product.list, staleTime: Infinity });
  const elements = useStore(
    (state) => getElements(state, products),
    (a, b) => _.isEqual(a, b),
  );

  const total = useMemo(() => elements.reduce((acc, element) => acc + element.quantity * element.price, 0), [elements]);

  return (
    <div className="scrollbar-hide z-50 mt-2 h-[82vh] overflow-auto rounded-md border-2 border-[#1a192b] bg-white">
      <div className=" mx-auto h-full w-fit px-1 py-2 transition-transform duration-100 ease-in-out">
        <div className=" mt-2 flex w-fit flex-col items-end justify-end backdrop-blur-md ">
          <div className="-mx-4 -my-2 w-fit overflow-x-auto sm:-mx-6  lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8 ">
              <div className="overflow-hidden border-none ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-500 ">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-900  ">
                        REFERENCE
                      </th>
                      <th scope="col" className=" px-6 py-1 text-center text-sm font-semibold text-gray-900">
                        QTE
                      </th>
                      <th scope="col" className=" px-6 py-3 text-center text-sm font-semibold text-gray-900">
                        CODE PX
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-500 ">
                    {elements?.map((camera) => (
                      <tr key={camera.id}>
                        <td className="whitespace-nowrap px-6 py-3 text-sm  ">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <img className="h-12 w-12" src={`https://bd.vizeo.eu/6-Photos/${camera.reference}/${camera.reference}.png`} alt="Camera" />
                            </div>
                            <div className="ml-2">
                              <div className="text-md font-bold text-gray-900">{camera.reference}</div>
                              {/* {(camera?.isOption || camera?.optionsIsOption) && <div className="text-md font-bold text-gray-900">(En option)</div>} */}
                            </div>
                          </div>
                        </td>
                        <td className="text-md whitespace-nowrap px-6 py-3 text-black">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="px-6 py-1 text-gray-900">{camera.quantity}</div>
                          </div>
                        </td>
                        <td className="text-md whitespace-nowrap px-6 py-3 text-black">
                          <span className="text-md  inline-flex font-bold leading-5 ">{`00${camera.price}`}</span>
                        </td>

                        <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between space-x-2 py-6">
            <div className="" />
            <p>Code</p> <p>00{total}</p>
          </div>
          <div className="w-full text-xs">
            <p>Prévoir en plus : Câble CAT6 S/FTP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
