import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { useShallow } from 'zustand/react/shallow';
import CustomSelect from '../../../../../../../../../../components/CustomSelect/CustomSelect';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import { ExpertStudyDensityCameraNode } from '../../../Flow/components/DensityCameraNode/DensityCameraNode';
import { ExpertStudyImageNode } from '../../../Flow/components/ImageNode/ImageNode';
import { ExpertStudyMonitorNode } from '../../../Flow/components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudyServiceNode } from '../../../Flow/components/ServiceNode/ServiceNode';
import { ExpertStudySynopticCameraNode } from '../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import useStore, { RFState } from '../../../Flow/utils/store';
import { RECORDER_NODES_DEFAULT_OPTIONS, RECORDERS_INCLUDED_PRODUCTS } from '../../../ModalProvider/components/RecorderModal/RecorderModal';
import { ExpertStudyTransmitterNode } from '../../../Flow/components/TransmitterNode/TransmitterNode';
import { CAMERAS_INCLUDED_PRODUCTS } from '../../../ModalProvider/components/CameraModal/CameraModal';
import { UNIVERSAL_CAMERAS_INCLUDED_PRODUCTS } from '../../../ModalProvider/components/UniversalCameraModal/UniversalCameraModal';
import { TRANSMITTERS_INCLUDED_PRODUCTS } from '../../../ModalProvider/components/TransmittersModal/TransmittersModal';
import { useEffect } from 'react';

const yupSchema = yup.object().shape({
  product: yup.mixed<ProductResponseDto>().required('Champs requis').defined('Champs requis'),
});

const selector = (state: RFState) => ({
  pageType: state.pages.at(state.currentPage)?.type,
});

export default function AppViewStudyViewExpertViewProductsMenuComponentProductSelectComponent() {
  const queryClient = useQueryClient();

  const { pageType } = useStore(useShallow(selector));
  const { addNodes, screenToFlowPosition } = useReactFlow();

  const { control, reset, handleSubmit, watch, getValues } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { data: products } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) =>
      products.filter((product) => {
        if (!product.reference) return false;
        switch (product.category) {
          case 'Caméra interieure':
          case 'Caméra exterieure':
          case 'Dôme motorisé':
            return CAMERAS_INCLUDED_PRODUCTS.includes(product.reference);
          case 'Caméra universelle':
            return UNIVERSAL_CAMERAS_INCLUDED_PRODUCTS.includes(product.reference);
          case 'Autres cameras':
          case 'Moniteur':
          case 'Services':
            return pageType === 'synoptic';
          case 'NVR':
            return pageType === 'synoptic' && RECORDERS_INCLUDED_PRODUCTS.includes(product.reference);
          case 'Transmission':
            return pageType === 'synoptic' && TRANSMITTERS_INCLUDED_PRODUCTS.includes(product.reference);
          default:
            return false;
        }
      }),
  });

  const onSubmit = ({ product }: yup.InferType<typeof yupSchema>) => {
    reset();

    const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
    const paneCenter = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width / 2, y: reactFlowRect.y });

    switch (product.category) {
      case 'Caméra interieure':
      case 'Caméra exterieure':
      case 'Dôme motorisé':
      case 'Caméra universelle':
      case 'Autres cameras': {
        switch (pageType) {
          case 'synoptic': {
            const nodeSize = { width: 80, height: 80 };
            const node = {
              id: uuidv4(),
              type: 'synopticCamera',
              position: { x: paneCenter.x - nodeSize.width / 2, y: paneCenter.y },
              data: {
                productId: product.id,
                options: [],
                size: nodeSize,
                opacity: 100,
              },
            } as ExpertStudySynopticCameraNode;

            addNodes([node]);
            break;
          }
          case 'density': {
            const hAngle = product.specificationProducts?.find((spec) => spec.specification?.name === 'ANGLE H');
            const angle = hAngle?.value || hAngle?.maxValue;
            const node = {
              id: uuidv4(),
              type: 'densityCamera',
              position: { x: paneCenter.x, y: paneCenter.y },
              style: {
                pointerEvents: 'none',
              },
              data: {
                productId: product.id,
                range: 10,
                rotation: 0,
                opacity: 100,
                angle,
              },
            } as ExpertStudyDensityCameraNode;
            addNodes([node]);
            break;
          }
        }
        break;
      }
      case 'Moniteur': {
        const nodeSize = { width: 80, height: 80 };
        const node = {
          id: uuidv4(),
          type: 'monitor',
          position: { x: paneCenter.x - nodeSize.width / 2, y: paneCenter.y },
          data: {
            productId: product.id,
            options: [],
            size: nodeSize,
            opacity: 100,
          },
        } as ExpertStudyMonitorNode;
        addNodes([node]);
        break;
      }
      case 'NVR': {
        const nodeSize = { width: 160, height: 160 };
        const nodePosition = { x: paneCenter.x - nodeSize.width / 2, y: paneCenter.y };

        const boxNodeSize = { width: 150, height: 150 };
        const boxNodePosition = { x: nodePosition.x + nodeSize.width, y: nodePosition.y };
        const options =
          RECORDER_NODES_DEFAULT_OPTIONS.find((option) => option.reference === product.reference)
            ?.options?.map((option) => {
              const opt = queryClient
                .getQueryData<Array<ProductResponseDto>>(queries.product.list.queryKey)
                ?.find((product) => product.reference === option.reference);
              if (!opt) return;
              return { id: opt.id, quantity: option.quantity };
            })
            .filter((option) => !!option) ?? [];

        const nodes: Array<ExpertStudyRecorderNode | ExpertStudyImageNode> = [];

        const recorderNode: ExpertStudyRecorderNode = {
          id: uuidv4(),
          type: 'recorder',
          position: nodePosition,
          data: {
            productId: product.id,
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
        addNodes(nodes);
        break;
      }
      case 'Transmission': {
        const nodeSize = product.reference === 'KIT50M' ? { width: 480, height: 480 } : { width: 160, height: 160 };
        const nodePosition = { x: paneCenter.x - nodeSize.width / 2, y: paneCenter.y };

        const node = {
          id: uuidv4(),
          type: 'transmitter',
          position: nodePosition,
          data: {
            productId: product.id,
            options: [],
            size: product.reference === 'KIT50M' ? { width: 480, height: 480 } : { width: 160, height: 160 },
            opacity: 100,
          },
        } as ExpertStudyTransmitterNode;
        addNodes([node]);

        break;
      }
      case 'Services': {
        const nodePosition = screenToFlowPosition({ x: reactFlowRect.x, y: reactFlowRect.y });
        const node = {
          id: uuidv4(),
          type: 'service',
          position: nodePosition,
          data: {
            productId: product.id,
            size: { width: 80, height: 80 },
            rotation: 0,
          },
        } as ExpertStudyServiceNode;
        addNodes([node]);
        break;
      }
    }
  };

  useEffect(() => {
    if (getValues('product')) handleSubmit(onSubmit)();
  }, [watch('product')]);

  return (
    <Controller
      control={control}
      name="product"
      render={({ field: { value, onChange, onBlur } }) => (
        <CustomSelect
          id="product_node_select"
          options={products}
          getOptionLabel={(product) => product.reference ?? ''}
          getOptionValue={(product) => product.id}
          value={value ?? null}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Sélectionnez un produit"
        />
      )}
    />
  );
}
