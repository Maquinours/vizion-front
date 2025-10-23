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
import { ExpertStudyTransmitterNode } from '../../../Flow/components/TransmitterNode/TransmitterNode';

const includedProducts = ['KIT50M', 'KITFIBRE', 'POE08', 'POE16', 'PONTWIFI', 'SG05'];

type Model = {
  product: ProductResponseDto;
  selected: boolean;
};

const yupSchema = yup.object().shape({
  models: yup.array().of(yup.mixed<Model>().required()).required('Champs requis'),
});

export default function AppViewStudyViewExpertViewModalProviderComponentTransmittersModalComponent() {
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const { setModal } = useContext(ExpertStudyContext)!;

  const { data: products } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) =>
      products.filter((product) => product.category === 'Transmission' && !!product.reference && includedProducts.includes(product.reference) && product.vizeo),
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

    const paneCenter = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width / 2, y: reactFlowRect.y });

    const nodes = models
      .filter((model) => model.selected)
      .map((model) => {
        const nodeSize = model.product.reference === 'KIT50M' ? { width: 480, height: 480 } : { width: 160, height: 160 };
        const nodePosition = { x: paneCenter.x - nodeSize.width / 2, y: paneCenter.y };

        return {
          id: uuidv4(),
          type: 'transmitter',
          position: nodePosition,
          data: {
            productId: model.product.id,
            options: [],
            size: model.product.reference === 'KIT50M' ? { width: 480, height: 480 } : { width: 160, height: 160 },
            opacity: 100,
          },
        } as ExpertStudyTransmitterNode;
      });

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
      <form className="w-full rounded-md bg-white pb-2" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="flex h-10 items-center justify-center rounded-t-md bg-[var(--primary-color)] text-white">TRANSMISSIONS</h2>
        <Controller
          control={control}
          name="models"
          render={({ field: { value, onChange } }) => (
            <div className="max-h-[30rem] overflow-y-scroll">
              {value.map((model) => (
                <button
                  key={model.product.id}
                  type="button"
                  className="mt-4 flex items-center justify-center space-x-4 px-4"
                  onClick={() => onChange(value.map((m) => (m.product.id === model.product.id ? { ...m, selected: !m.selected } : m)))}
                >
                  <div className="flex h-36 w-[30rem] items-center justify-center rounded-md border border-slate-800 px-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-16 w-36 rounded-md p-4">
                        <img
                          src={`https://bd.vizeo.eu/6-Photos/${model.product.reference}/PLUG_${model.product.reference}.png`}
                          alt={`Produit ${model.product.reference}`}
                        />
                      </div>
                      <p className="first-letter:uppercase">{model.product.shortDescription}</p>
                    </div>

                    <div className="ml-16 border-l border-l-slate-700 pl-4">
                      <p>{model.product.reference}</p>
                      <p>Code:{`${model.product.publicPrice ?? ''}`.padStart(5, '0')}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <input type="checkbox" checked={model.selected} readOnly={true} />
                  </div>
                </button>
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

export { includedProducts as TRANSMITTERS_INCLUDED_PRODUCTS };
