import { yupResolver } from '@hookform/resolvers/yup';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import ExpertStudyContext from '../../../../utils/context';
import { ExpertStudyMonitorNode } from '../../../Flow/components/MonitorNode/MonitorNode';

type Model = {
  product: ProductResponseDto;
  selected: boolean;
};

const yupSchema = yup.object().shape({
  models: yup.array().of(yup.mixed<Model>().required()).required('Champs requis.'),
});

export default function AppViewStudyViewExpertViewModalProviderComponentMonitorModalComponent() {
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const { setModal } = useContext(ExpertStudyContext)!;

  const { data: products } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) => products.filter((product) => product.category === 'Moniteur'),
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
    const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();

    const paneCenter = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width / 2, y: reactFlowRect.y });
    const nodeSize = { width: 80, height: 80 };

    const nodes = models
      .filter((model) => model.selected)
      .map(
        (model) =>
          ({
            id: uuidv4(),
            type: 'monitor',
            position: { x: paneCenter.x - nodeSize.width / 2, y: paneCenter.y },
            data: {
              productId: model.product.id,
              options: [],
              size: nodeSize,
              opacity: 100,
            },
          }) as ExpertStudyMonitorNode,
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
    <ReactModal
      isOpen
      className="absolute left-2/4 top-2/4 m-auto h-auto w-auto min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-md bg-white pb-2">
        <h2 className="flex h-10 items-center justify-center rounded-t-md bg-[var(--primary-color)] text-white">MONITEURS</h2>
        <Controller
          control={control}
          name="models"
          render={({ field: { value, onChange } }) => (
            <div>
              {value.map((model) => (
                <div
                  key={model.product.id}
                  className="mt-4 flex items-center justify-center space-x-4 px-4"
                  onClick={() => onChange(value.map((m) => (m.product.id === model.product.id ? { ...m, selected: !m.selected } : m)))}
                >
                  <div className="flex w-[30rem] items-center justify-center rounded-md border border-slate-800 px-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-36 overflow-hidden">
                        <img src={`https://bd.vizeo.eu/6-Photos/${model.product.reference}/${model.product.reference}.png`} />
                      </div>
                      <p>{model.product.shortDescription}</p>
                    </div>

                    <div className="ml-16 border-l border-l-slate-700 pl-4">
                      <p>{model.product.reference}</p>
                      <p>Code:{`${model.product.publicPrice}`.padStart(5, '0')}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <input type={'checkbox'} checked={model.selected} readOnly={true} />
                  </div>
                </div>
              ))}
            </div>
          )}
        />
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
  );
}