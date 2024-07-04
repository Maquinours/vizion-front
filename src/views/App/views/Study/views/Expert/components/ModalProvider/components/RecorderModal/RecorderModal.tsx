import { useContext, useEffect } from 'react';
import ReactModal from 'react-modal';
import ExpertStudyContext from '../../../../utils/context';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import { yupResolver } from '@hookform/resolvers/yup';
import { Node, useReactFlow } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { AppViewStudyViewExpertViewFlowComponentRecorderNodeComponentData } from '../../../Flow/components/RecorderNode/RecorderNode';
import { AppViewStudyViewExpertViewFlowComponentImageNodeComponentData } from '../../../Flow/components/ImageNode/ImageNode';

const includedProducts = ['HD504PAP', 'HD508PAP', 'HD516PAP', 'HD732', 'HD764', 'MX16HD'];

type Model = {
  product: ProductResponseDto;
  selected: boolean;
};

const yupSchema = yup.object().shape({
  models: yup.array().of(yup.mixed<Model>().required()).required('Champs requis'),
});

export default function AppViewStudyViewExpertViewModalProviderComponentRecorderModalComponent() {
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const { setModal } = useContext(ExpertStudyContext)!;

  const { data: products } = useSuspenseQuery({
    ...queries.product.list,
    select: (products) => products.filter((product) => product.category === 'NVR' && !!product.reference && includedProducts.includes(product.reference)),
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

    const paneCenter = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width / 2, y: reactFlowRect.y + reactFlowRect.height / 2 });

    const nodeSize = { width: 160, height: 160 };
    const nodePosition = { x: paneCenter.x - nodeSize.width / 2, y: paneCenter.y };

    const boxNodeSize = { width: 150, height: 150 };
    const boxNodePosition = { x: nodePosition.x + nodeSize.width, y: nodePosition.y };

    const atNodeSize = { width: 150, height: 150 };
    const atNodePosition = { x: boxNodePosition.x + boxNodeSize.width, y: nodePosition.y };

    const nodes = [];

    for (const model of models.filter((model) => model.selected)) {
      const recorderNode: Node<AppViewStudyViewExpertViewFlowComponentRecorderNodeComponentData> = {
        id: uuidv4(),
        type: 'recorder',
        position: nodePosition,
        data: {
          productId: model.product.id,
          options: [],
          size: nodeSize,
          opacity: 100,
        },
      };
      nodes.push(recorderNode);
      const boxNode: Node<AppViewStudyViewExpertViewFlowComponentImageNodeComponentData> = {
        id: uuidv4(),
        type: 'image',
        position: boxNodePosition,
        data: {
          image: 'https://bd.vizeo.eu/6-Photos/BOX/Box.png',
          size: boxNodeSize,
          opacity: 100,
          rotation: 0,
        },
      };
      nodes.push(boxNode);
      if (model.product.reference?.endsWith('PAP')) {
        const atNode: Node<AppViewStudyViewExpertViewFlowComponentImageNodeComponentData> = {
          id: uuidv4(),
          type: 'image',
          position: atNodePosition,
          data: {
            image: 'https://bd.vizeo.eu/6-Photos/AT1/AT1.png',
            size: atNodeSize,
            opacity: 100,
            rotation: 0,
          },
        };
        nodes.push(atNode);
      }
    }
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
  });

  return (
    <ReactModal
      isOpen
      className="absolute left-2/4 top-2/4 m-auto h-auto w-auto min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <form className="w-full rounded-md bg-white pb-2" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="flex h-10 items-center justify-center rounded-t-md bg-[var(--primary-color)] text-white">ENREGISTREURS</h2>
        <Controller
          control={control}
          name="models"
          render={({ field: { value, onChange } }) => (
            <div className="max-h-[30rem] overflow-y-scroll">
              {value.map((model) => (
                <div
                  key={model.product.id}
                  className="mt-4 flex items-center justify-center space-x-4 px-4"
                  onClick={() => onChange(value.map((m) => (m.product.id === model.product.id ? { ...m, selected: !m.selected } : m)))}
                >
                  <div className="flex h-36 w-[30rem] items-center justify-center rounded-md border border-slate-800 px-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-16 w-36 rounded-md p-4">
                        <img src={`https://bd.vizeo.eu/6-Photos/${model.product.reference}/PLUG_${model.product.reference}.png`} />
                      </div>
                      <p className="first-letter:uppercase">{model.product.shortDescription}</p>
                    </div>

                    <div className="ml-16 border-l border-l-slate-700 pl-4">
                      <p>{model.product.reference}</p>
                      <p>Code: {`${model.product.publicPrice ?? ''}`.padStart(5, '0')}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <input type="checkbox" checked={model.selected} readOnly={true} />
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
