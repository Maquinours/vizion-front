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
import AppViewStudyViewExpertViewModalProviderComponentOthersCamerasModalComponentDensityModalComponent from './components/DensityModal/DensityModal';

type Model = {
  product: ProductResponseDto;
  selected: boolean;
};

const yupSchema = yup.object().shape({
  models: yup.array().of(yup.mixed<Model>().required()).required(),
});

export default function AppViewStudyViewExpertViewModalProviderComponentOthersCamerasModalComponent() {
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const { setModal } = useContext(ExpertStudyContext)!;

  const { data: products } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) => products.filter((product) => product.category === 'Autres cameras' && !!product.reference && product.vizeo),
  });

  const { setValue, getValues, control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      models: [],
    },
  });

  const [densityModalProduct, setDensityModalProduct] = useState<ProductResponseDto>();

  const onClose = () => {
    setModal(undefined);
  };

  const onSubmit = ({ models }: yup.InferType<typeof yupSchema>) => {
    const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();

    const paneCenter = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width / 2, y: reactFlowRect.y });
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
        <form className="w-full rounded-md bg-white pb-2" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="flex h-10 items-center justify-center rounded-t-md bg-(--primary-color) text-white">AUTRES CAMÉRAS</h2>
          <div className="mx-2 mt-4 overflow-hidden rounded-md border border-[#16204e] bg-white">
            <Controller
              control={control}
              name="models"
              render={({ field: { value, onChange } }) => (
                <div className="flex items-center justify-center">
                  {value.map((model) => (
                    <button
                      key={model.product.id}
                      type="button"
                      className="flex w-48 flex-col items-center justify-center space-y-2 border border-[#16204e] bg-slate-200 p-4"
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
                      <p>Code: {`${model.product.publicPrice ?? ''}`.padStart(5, '0')}</p>

                      <img
                        src={`https://bd.vizeo.eu/6-Photos/${model.product.reference}/${model.product.reference}.png`}
                        alt={`Produit ${model.product.reference}`}
                        className="h-14 rounded-md"
                      />
                      <div className="flex items-center justify-center space-x-2">
                        <input type={'checkbox'} checked={model.selected} readOnly={true} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="mt-6 flex items-center justify-center space-x-2">
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
        <AppViewStudyViewExpertViewModalProviderComponentOthersCamerasModalComponentDensityModalComponent
          product={densityModalProduct}
          onClose={() => setDensityModalProduct(undefined)}
        />
      )}
    </>
  );
}
