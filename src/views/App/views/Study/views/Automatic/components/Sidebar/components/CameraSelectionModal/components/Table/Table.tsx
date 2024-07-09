/// <reference types="vite-plugin-svgr/client" />

import { classNames } from '@react-pdf-viewer/core';
import { ReactFlowState, useStore } from '@xyflow/react';
import LogoIdentification from '../../../../../../../../../../../../assets/images/identification.svg?react';
import LogoLecturePlaque from '../../../../../../../../../../../../assets/images/lecture_plaque.svg?react';
import LogoReconnaissance from '../../../../../../../../../../../../assets/images/reconnaissance.svg?react';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';

type Model = {
  product: ProductResponseDto;
  data: { bestSeller: boolean; identification: number; plaque: number; reconnaissance: number; pir: number };
  quantity: number;
};

type Models = Array<Model>;

const getCameraNodesNumber = (state: ReactFlowState) => {
  return Array.from(state.nodeLookup.values()).filter((node) => node.type === 'independantNode').length;
};

type AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponentTableComponentProps = Readonly<{
  models: Models;
  setModels: React.Dispatch<React.SetStateAction<Models>>;
  openDensityModal: (product: ProductResponseDto) => void;
  openTooMuchProductsModal: () => void;
}>;
export default function AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponentTableComponent({
  models,
  setModels,
  openDensityModal,
  openTooMuchProductsModal,
}: AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponentTableComponentProps) {
  const cameraNodesNumber = useStore(getCameraNodesNumber);

  const increment = (model: Model) => {
    if (cameraNodesNumber + models.reduce((acc, model) => acc + model.quantity, 0) === 16) openTooMuchProductsModal();
    else setModels(models.map((m) => (m.product.id === model.product.id ? { ...m, quantity: m.quantity + 1 } : m)));
  };

  const decrement = (model: Model) => {
    setModels(models.map((m) => (m.product.id === model.product.id ? { ...m, quantity: m.quantity - 1 } : m)));
  };

  return (
    <div className="flex w-fit min-w-[660px]  flex-1 flex-col items-center justify-start rounded-md border-2 border-t-0 border-[#31385A]">
      <h1 className="flex h-8 w-full items-center justify-center rounded-t-md bg-[#31385A] text-white">Faire quoi à quelle distance</h1>
      <div className="w-full pl-6 pr-6 pt-6">
        <div className="flex">
          <div className="flex-[2_2_0%]"></div>
          {models.map((model) => (
            <div key={model.product.id} className="flex flex-1 justify-center">
              <button
                type="button"
                className="h-7 w-20 rounded-lg border-2 border-solid border-[#31385A] text-[10px]"
                onClick={() => openDensityModal(model.product)}
              >
                Voir produit
              </button>
            </div>
          ))}
        </div>
        <table className="mt-1.5 w-full">
          <tbody>
            <tr className="flex h-full w-full">
              <th className="flex-[2_2_0%]"></th>
              {models.map((model, index, arr) => (
                <th
                  key={model.product.id}
                  className={`flex-1 bg-[#31385A] text-white ${classNames({
                    'rounded-tr-md': index == arr.length - 1,
                  })}`}
                >
                  <p>{model.product.reference}</p>
                  <p className="text-xs">Code : {`${model.product.publicPrice}`.padStart(5, '0')}</p>
                </th>
              ))}
            </tr>
            <tr className="flex">
              <th className="flex-[2_2_0%] rounded-tl-md border-b-2 border-l-2 border-t-2 border-[#31385A] bg-[#101735] text-white">
                <div className="flex">
                  <div className="flex items-center p-2">
                    <LogoIdentification fill="white" width={36} height={36} />
                  </div>
                  <div className="p-2">
                    <p>Identification</p>
                    <p className="text-xs">min. 250 pixels/m*</p>
                  </div>
                </div>
              </th>
              {models.map((model) => (
                <td key={model.product.id} className="flex flex-1 items-center justify-center border-b-2 border-r-2 border-[#313751] text-[#16204E]">
                  {model.data.identification}m{!!model.data.pir && model.data.identification > model.data.pir ? '¹' : ''}
                </td>
              ))}
            </tr>
            <tr className="flex">
              <th scope="row" className="flex-[2_2_0%] border-b-2 border-l-2 border-[#31385A] bg-[#6F7592] text-white">
                <div className="flex">
                  <div className="flex items-center p-2">
                    <LogoLecturePlaque fill="white" width={36} height={36} />
                  </div>
                  <div className="p-2">
                    <p>Lecture de plaque</p>
                    <p className="text-xs">min. 150 pixels/m*</p>
                  </div>
                </div>
              </th>
              {models.map((model) => (
                <td key={model.product.id} className="flex flex-1 items-center justify-center border-b-2 border-r-2 border-[#313751] text-[#16204E]">
                  {model.data.plaque}m{!!model.data.pir && model.data.plaque > model.data.pir ? '¹' : ''}
                </td>
              ))}
            </tr>
            <tr className="flex">
              <th scope="row" className="flex-[2_2_0%] rounded-bl-md border-b-2 border-l-2 border-[#31385A] bg-[#EAEAEF] text-black">
                <div className="flex">
                  <div className="flex items-center p-2">
                    <LogoReconnaissance fill="black" width={36} height={36} />
                  </div>
                  <div className="p-2">
                    <p>Reconnaissance</p>
                    <p className="text-xs">min. 125 pixels/m*</p>
                  </div>
                </div>
              </th>
              {models.map((model, index, arr) => (
                <td
                  key={model.product.id}
                  className={`flex flex-1 items-center justify-center border-b-2 border-r-2 border-[#313751] text-[#16204E] ${classNames({ 'rounded-br-md': index === arr.length - 1 })}`}
                >
                  {model.data.reconnaissance}m{model.data.pir && model.data.reconnaissance > model.data.pir ? '¹' : ''}
                </td>
              ))}
            </tr>
            <tr className="flex h-2">
              <td className="flex-[2_2_0%] border-l-2 border-transparent"></td>
              <td className="flex-1 border-l-2 border-transparent"></td>
              {models.map((model) => (
                <td key={model.product.id} className="flex-1"></td>
              ))}
            </tr>
            <tr className="flex w-full rounded-l-md">
              <td className="flex-[1_1_0%] border-l-2 border-transparent"></td>
              <td className={`flex-1 rounded-l-md border-y-2 border-l-2 border-[#31385A] bg-[#676A83] text-[#FBFCFE]`}>
                <div className="p-2">Quantité</div>
              </td>
              {models.map((model) => (
                <td
                  key={model.product.id}
                  className={`flex-1 border-b-2 border-r-2 border-t-2 border-[#31385A]  text-[#16204E] ${
                    model == models[models.length - 1] ? 'rounded-r-md' : ''
                  }`}
                >
                  <div className="flex p-2">
                    <div className="flex flex-1 items-center justify-center">
                      <button
                        type="button"
                        className=" h-5 w-5 rounded-full border-2 bg-red-400 leading-3"
                        disabled={model.quantity === 0}
                        onClick={() => decrement(model)}
                      >
                        -
                      </button>
                    </div>
                    {model.quantity}
                    <div className="flex flex-1 items-center justify-center">
                      <button type="button" className=" h-5 w-5 rounded-full border-2 bg-green-400 leading-3" onClick={() => increment(model)}>
                        +
                      </button>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div className="flex">
          <p className="flex-[2_2_0%] text-left text-xs font-bold text-[#16204E]">¹ Valeur mode jour</p>
          <div className="flex-0"></div>
          {models.map((model) => (
            <div key={model.product.id} className="flex-1 text-center text-xs font-bold text-[#F24C52]">
              {!!model.data.bestSeller && 'MEILLEURES VENTES'}
            </div>
          ))}
        </div>
        <div className="mt-2 flex">
          <p className="flex-[2_2_0%] text-left text-xs font-bold text-[#16204E]">*Norme Européenne EN 62676-4</p>
        </div>
      </div>
    </div>
  );
}
