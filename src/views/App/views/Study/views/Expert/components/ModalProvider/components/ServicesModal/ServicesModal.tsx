import { useContext, useEffect } from 'react';
import ReactModal from 'react-modal';
import ExpertStudyContext from '../../../../utils/context';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import { yupResolver } from '@hookform/resolvers/yup';
import { useReactFlow } from '@xyflow/react';
import { ExpertStudyMiscProductNode } from '../../../Flow/components/MiscProductNode/MiscProductNode';
import { ExpertStudyNode } from '../../../Flow/utils/store';
import { v4 as uuidv4 } from 'uuid';

type Model = {
  product: ProductResponseDto;
  selected: boolean;
};

const yupSchema = yup.object().shape({
  models: yup.array().of(yup.mixed<Model>().required()).required(),
});

export default function AppViewStudyViewExpertViewModalProviderComponentServicesModalComponent() {
  const { setModal } = useContext(ExpertStudyContext)!;
  const { addNodes, screenToFlowPosition } = useReactFlow<ExpertStudyNode>();

  const { data: products } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) => products.filter((product) => product.category === 'Services'),
  });

  const { setValue, getValues, control, handleSubmit } = useForm({
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
    const nodePosition = screenToFlowPosition({ x: reactFlowRect.x, y: reactFlowRect.y });

    const nodes = models
      .filter((model) => model.selected)
      .map(
        (model) =>
          ({
            id: uuidv4(),
            type: 'misc-product',
            position: nodePosition,
            data: {
              productId: model.product.id,
              size: { width: 80, height: 80 },
              rotation: 0,
            },
          }) as ExpertStudyMiscProductNode,
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
      className="absolute top-2/4 left-2/4 m-auto h-auto w-auto max-w-[80%] min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <form className="w-full rounded-md bg-white pb-2" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="flex h-10 items-center justify-center rounded-t-md bg-(--primary-color) text-white">SERVICES</h2>
        <div className="mx-2 mt-4 rounded-md border border-[#16204e] bg-white">
          <Controller
            control={control}
            name="models"
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center overflow-auto">
                {value && value.map((model) => (
                  <button
                    key={model.product.id}
                    type="button"
                    className="flex w-48 flex-col items-center justify-center space-y-2 border border-[#16204e] bg-slate-200 p-4"
                    onClick={() => onChange(value.map((m) => (m.product.id === model.product.id ? { ...m, selected: !m.selected } : m)))}
                  >
                    <p className="text-left">{model.product.reference}</p>
                    <p>Code: {`${model.product.publicPrice ?? ''}`.padStart(5, '0')}</p>

                    <img
                      src={`https://bd.vizeo.eu/6-Photos/${model.product.reference}/${model.product.reference}.webp`}
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
  );
}
