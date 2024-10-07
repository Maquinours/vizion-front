import { yupResolver } from '@hookform/resolvers/yup';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import ExpertStudyContext from '../../../../utils/context';
import { ExpertStudySynopticCameraNode } from '../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import AppViewStudyViewExpertViewModalProviderComponentUniversalCameraModalComponentDensityModalComponent from './components/DensityModal/DensityModal';
import useStore, { RFState } from '../../../Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';
import { ExpertStudyDensityCameraNode } from '../../../Flow/components/DensityCameraNode/DensityCameraNode';

const includedProducts = ['DA350PAP', 'DO505PAP', 'FE180'];

type Model = {
  product: ProductResponseDto;
  selected: boolean;
};

const yupSchema = yup.object().shape({
  models: yup.array().of(yup.mixed<Model>().required()).required('Champs requis.'),
});

const selector = (state: RFState) => ({
  getPageType: state.getPageType,
});

export default function AppViewStudyViewExpertViewModalProviderComponentUniversalCameraModalComponent() {
  const { getPageType } = useStore(useShallow(selector));
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const { setModal } = useContext(ExpertStudyContext)!;

  const [densityModalProduct, setDensityModalProduct] = useState<ProductResponseDto>();

  const { data: products } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) =>
      products.filter((product) => product.category === 'Caméra universelle' && !!product.reference && includedProducts.includes(product.reference)),
  });

  const { getValues, setValue, control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      models: [],
    },
  });

  const onClose = () => {
    setModal(undefined);
  };

  const onSubmit = ({ models }: yup.InferType<typeof yupSchema>) => {
    // TODO: set nodes in case of density
    const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();

    const paneCenter = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width / 2, y: reactFlowRect.y });

    const pageType = getPageType();
    switch (pageType) {
      case 'synoptic': {
        const nodeSize = { width: 80, height: 80 };
        const nodes = models
          .filter((model) => model.selected)
          .map(
            (model) =>
              ({
                id: uuidv4(),
                type: 'synopticCamera',
                position: { x: paneCenter.x - nodeSize.width / 2, y: paneCenter.y },
                data: {
                  productId: model.product.id,
                  options: [],
                  size: nodeSize,
                  opacity: 100,
                },
              }) as ExpertStudySynopticCameraNode,
          );
        addNodes(nodes);
        break;
      }
      case 'density': {
        const nodes = models
          .filter((model) => model.selected)
          .map((model) => {
            const hAngle = model.product.specificationProducts?.find((spec) => spec.specification?.name === 'ANGLE H');
            const angle = hAngle?.value || hAngle?.maxValue;
            if (!angle) return undefined;
            return {
              id: uuidv4(),
              type: 'densityCamera',
              position: { x: paneCenter.x, y: paneCenter.y },
              style: {
                pointerEvents: 'none',
              },
              data: {
                productId: model.product.id,
                range: 10,
                rotation: 0,
                opacity: 100,
                angle,
              },
            } as ExpertStudyDensityCameraNode;
          })
          .filter((node): node is ExpertStudyDensityCameraNode => !!node);
        addNodes(nodes);
        break;
      }
    }
    onClose();
  };

  useEffect(() => {
    const models = getValues('models');
    setValue(
      'models',
      products.map((product) => ({
        product,
        selected: models.find((model) => model.product.id === product.id)?.selected ?? false,
      })),
    );
  }, [products]);

  return (
    <>
      <ReactModal
        isOpen
        className="absolute left-2/4 top-2/4 m-auto h-auto w-auto min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
        overlayClassName="Overlay"
        onRequestClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-md bg-white pb-2">
          <h2 className="flex h-10 items-center justify-center rounded-t-md bg-[var(--primary-color)] text-white">Caméras universelles</h2>
          <Controller
            control={control}
            name="models"
            render={({ field: { value, onChange } }) => (
              <div className="flex flex-row">
                {value.map((model) => (
                  <div
                    key={model.product.id}
                    className="flex flex-col items-center justify-center space-y-2 border-[0.5px] border-[#16204e] bg-slate-200 p-4"
                    onClick={() => onChange(value.map((m) => (m.product.id === model.product.id ? { ...m, selected: !m.selected } : m)))}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDensityModalProduct(model.product);
                      }}
                      className="btn btn-primary"
                    >
                      Afficher en grand
                    </button>
                    <p className="text-left">{model.product.reference}</p>
                    <p>Code: {`${model.product.publicPrice}`.padStart(5, '0')}</p>

                    <img
                      src={`https://bd.vizeo.eu/6-Photos/${model.product.reference}/${model.product.reference}.png`}
                      alt="CamUni"
                      className="h-32 rounded-md"
                    />
                    <div className="flex items-center justify-center space-x-2">
                      <input className="camselection_input" type="checkbox" checked={model.selected} readOnly={true} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
          <div className="mt-6 flex items-center justify-center space-x-2 px-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Valider
            </button>
          </div>
        </form>
      </ReactModal>
      {!!densityModalProduct && (
        <AppViewStudyViewExpertViewModalProviderComponentUniversalCameraModalComponentDensityModalComponent
          product={densityModalProduct}
          onClose={() => setDensityModalProduct(undefined)}
        />
      )}
    </>
  );
}

export { includedProducts as UNIVERSAL_CAMERAS_INCLUDED_PRODUCTS };
