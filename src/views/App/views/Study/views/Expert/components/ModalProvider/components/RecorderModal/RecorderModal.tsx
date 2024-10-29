import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { useContext, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import ExpertStudyContext from '../../../../utils/context';
import { ExpertStudyImageNode } from '../../../Flow/components/ImageNode/ImageNode';
import { ExpertStudyRecorderNode } from '../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudySynopticCameraNode } from '../../../Flow/components/SynopticCameraNode/SynopticCameraNode';

const includedProducts = ['HD504PAP', 'HD508PAP', 'HD516PAP', 'HD732', 'HD764', 'MX16HD'];

const DEFAULT_OPTIONS = [
  {
    reference: 'HD732',
    options: [
      {
        reference: 'DD4TO',
        quantity: 2,
      },
      {
        reference: 'INT1DD',
        quantity: 2,
      },
      {
        reference: 'AT2',
        quantity: 1,
      },
      {
        reference: 'AFFICHE',
        quantity: 2,
      },
    ],
  },
  {
    reference: 'HD764',
    options: [
      {
        reference: 'DD4TO',
        quantity: 4,
      },
      {
        reference: 'INT1DD',
        quantity: 4,
      },
      {
        reference: 'AFFICHE',
        quantity: 4,
      },
      {
        reference: 'AT3',
        quantity: 1,
      },
    ],
  },
];

type Model = {
  product: ProductResponseDto;
  selected: boolean;
};

const yupSchema = yup.object().shape({
  models: yup.array().of(yup.mixed<Model>().required()).required('Champs requis'),
});

export default function AppViewStudyViewExpertViewModalProviderComponentRecorderModalComponent() {
  const queryClient = useQueryClient();
  const { addNodes, screenToFlowPosition, getNodes } = useReactFlow();
  const { setModal } = useContext(ExpertStudyContext)!;

  const { data: products } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) => products.filter((product) => product.category === 'NVR' && !!product.reference && includedProducts.includes(product.reference)),
  });

  const { getValues, setValue, control, handleSubmit, watch } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      models: [],
    },
  });

  const selectedModelsLength = useMemo(() => getValues('models').filter((model) => model.selected).length, [watch('models')]);

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

    const nodes = [];

    for (const model of models.filter((model) => model.selected)) {
      const options =
        DEFAULT_OPTIONS.find((option) => option.reference === model.product.reference)
          ?.options?.map((option) => {
            const opt = queryClient
              .getQueryData<Array<ProductResponseDto>>(queries.product.list.queryKey)
              ?.find((product) => product.reference === option.reference);
            if (!opt) return;
            return { id: opt.id, quantity: option.quantity };
          })
          .filter((option) => !!option) ?? [];
      const recorderNode: ExpertStudyRecorderNode = {
        id: uuidv4(),
        type: 'recorder',
        position: nodePosition,
        data: {
          productId: model.product.id,
          options: options,
          size: nodeSize,
          opacity: 100,
        },
      };
      nodes.push(recorderNode);
      const boxNode: ExpertStudyImageNode = {
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
    }
    addNodes(nodes);
    onClose();
  };

  useEffect(() => {
    const models = getValues('models');
    const newModels = products.map((product) => ({
      product,
      selected: models.find((model) => model.product.id === product.id)?.selected ?? false,
    }));
    if (!newModels.some((model) => model.selected)) {
      const cams = getNodes()
        .filter((node): node is ExpertStudySynopticCameraNode => node.type === 'synopticCamera')
        .reduce((acc, node) => acc + (node.data.quantity ?? 1), 0);
      const selectedReference = (() => {
        if (cams <= 4) return 'HD504PAP';
        else if (cams <= 8) return 'HD508PAP';
        else if (cams <= 16) return 'HD516PAP';
      })();
      if (!!selectedReference) {
        const model = newModels.find((model) => model.product.reference === selectedReference);
        if (model) model.selected = true;
      }
    }
    setValue('models', newModels);
  }, [products]);

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
        <div className="mt-6 flex flex-col items-center justify-center gap-y-2">
          <span className="text-center text-[var(--primary-color)]">
            {selectedModelsLength} élément{selectedModelsLength > 1 ? 's' : ''} sélectionné{selectedModelsLength > 1 ? 's' : ''}
          </span>
          <div className="flex items-center justify-center space-x-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Valider
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
}

export { includedProducts as RECORDERS_INCLUDED_PRODUCTS, DEFAULT_OPTIONS as RECORDER_NODES_DEFAULT_OPTIONS };
