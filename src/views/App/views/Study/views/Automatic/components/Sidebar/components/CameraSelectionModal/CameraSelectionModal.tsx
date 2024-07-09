import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { BiShow } from 'react-icons/bi';
import ReactModal from 'react-modal';
import { useReactFlow } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponentTableComponent from './components/Table/Table';
import AppViewStudyViewAutomaticViewSidebarComponentTooMuchProductsModalComponent from './components/TooMuchProductsModal/TooMuchProductsModal';

const bestSellers = ['DA330HD', 'DA450HD'];

type AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponentProps = {
  onClose: () => void;
  type: 'Caméra interieure' | 'Caméra exterieure' | 'Dôme motorisé' | 'Caméra universelle';
  openDensityModal: (product: ProductResponseDto) => void;
};
export default function AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponent({
  type,
  onClose,
  openDensityModal,
}: AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponentProps) {
  const { addNodes } = useReactFlow();

  const [models, setModels] = useState<
    Array<{
      product: ProductResponseDto;
      data: { bestSeller: boolean; identification: number; plaque: number; reconnaissance: number; pir: number };
      quantity: number;
    }>
  >([]);
  const [showDomeModal, setShowDomeModal] = useState(false);
  const [showTooMuchProductsModal, setShowTooMuchProductsModal] = useState(false);

  const { data: products } = useQuery({
    ...queries.product.list,
    select: (products) => products.filter((product) => product.category === type),
    staleTime: Infinity,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nodes = [];
    for (const model of models) {
      for (let i = 0; i < model.quantity; i++) {
        nodes.push({
          id: uuidv4(),
          type: 'independantNode',
          position: {
            x: 50,
            y: 0,
          },
          width: 70,
          height: 70,
          draggable: true,
          data: {
            options: [],
            model: {
              id: model.product.id,
              reference: model.product.reference,
            },
          },
        });
      }
    }
    addNodes(nodes);
    onClose();
  };

  useEffect(() => {
    setModels(
      (models) =>
        products?.map((product) => {
          const bestSeller = !!product.reference && bestSellers.includes(product.reference);
          const identification = product.specificationProducts?.find((spec) => spec.specification?.name === 'IDENTIFICATION')?.value ?? 0;
          const plaque = product.specificationProducts?.find((spec) => spec.specification?.name === 'LECTURE DE PLAQUE')?.value ?? 0;
          const reconnaissance = product.specificationProducts?.find((spec) => spec.specification?.name === 'RECONNAISSANCE')?.value ?? 0;
          const pir = product.specificationProducts?.find((spec) => spec.specification?.name === 'PIR')?.value ?? 0;
          const model = models.find((model) => model.product.id === product.id);
          return { product, data: { bestSeller, identification, plaque, reconnaissance, pir }, quantity: model?.quantity ?? 0 };
        }) ?? [],
    );
  }, [products]);

  return (
    <>
      <ReactModal
        isOpen
        className="absolute left-2/4 top-2/4 m-auto h-auto w-auto min-w-[70%] max-w-[1000px] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
        overlayClassName="Overlay"
        onRequestClose={onClose}
      >
        {products && (
          <div className="w-full">
            <h1 className="flex h-8 w-full items-center justify-center rounded-t-md bg-[#31385A] text-white">Choix de la densité</h1>
            <div className="bg-[#FFFFFF] pb-1">
              <div className="mb-4 ml-4 mr-4">
                <div className="flex text-[#16204E]">
                  <p className="text-start text-sm font-bold">{"*Schémas à l'échelle"}</p>
                </div>
                <form onSubmit={onSubmit}>
                  <div className="flex flex-row flex-wrap gap-6">
                    <AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponentTableComponent
                      models={models}
                      setModels={setModels}
                      openDensityModal={openDensityModal}
                      openTooMuchProductsModal={() => setShowTooMuchProductsModal(true)}
                    />
                  </div>
                  {type === 'Caméra exterieure' && ( // TODO: set up the modal for the dome camera
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        className="grid w-80 grid-cols-3 place-items-center rounded-md border-2 shadow-md"
                        onClick={() => {
                          setShowDomeModal(true);
                        }}
                      >
                        <img src={'https://bd.vizeo.eu/6-Photos/DO518HD/DO518HD.jpg'} style={{ width: '70px' }} className="mr-2" />
                        <p className="text-black-700 w-32 text-sm font-bold ">{'Dôme Motorisé'}</p>
                        <BiShow
                          className="cursor-pointer"
                          style={{
                            width: '50px',
                            height: '20px',
                            fontWeight: 'bold',
                          }}
                        />
                      </button>
                    </div>
                  )}
                  <div className="mt-8 flex gap-x-6">
                    <div className="flex-1 text-right">
                      <button type="button" className="btn btn-secondary" onClick={() => onClose()}>
                        Annuler
                      </button>
                    </div>
                    <div className="flex-1 text-left">
                      <button type="submit" className="btn btn-primary">
                        Valider
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </ReactModal>
      {type === 'Caméra exterieure' && !!showDomeModal && (
        <AppViewStudyViewAutomaticViewSidebarComponentCameraSelectionModalComponent
          type="Dôme motorisé"
          onClose={() => {
            setShowDomeModal(false);
            onClose();
          }}
          openDensityModal={openDensityModal}
        />
      )}
      {showTooMuchProductsModal && (
        <AppViewStudyViewAutomaticViewSidebarComponentTooMuchProductsModalComponent onClose={() => setShowTooMuchProductsModal(false)} />
      )}
    </>
  );
}
