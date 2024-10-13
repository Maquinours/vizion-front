import { yupResolver } from '@hookform/resolvers/yup';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BiShow } from 'react-icons/bi';
import ReactModal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import ExpertStudyContext, { ExpertStudyModalType } from '../../../../utils/context';
import { ExpertStudySynopticCameraNode } from '../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import AppViewStudyViewExpertViewModalProviderComponentTableComponent from './components/Table/Table';
import useStore, { RFState } from '../../../Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';
import { ExpertStudyDensityCameraNode } from '../../../Flow/components/DensityCameraNode/DensityCameraNode';

const bestSellers = ['CA10HD', 'CA50HD', 'DA330HD', 'DA450HD'];
const includedProducts = [
  'DA330HD',
  'DA430HD',
  'DA630HD',
  'DA350HD',
  'DA450HD',
  'DA650HD',
  'CA10HD',
  'CA40HD',
  'CA60HD',
  'CA20HD',
  'CA50HD',
  'CA80HD',
  'DO518HD',
  'DO530HD',
];

type Model = {
  product: ProductResponseDto;
  selected: boolean;
  data: { bestSeller: boolean; identification: number; plaque: number; reconnaissance: number; pir: number | undefined };
};

const yupSchema = yup.object().shape({
  models: yup.array().of(yup.mixed<Model>().required()).required('Champs requis.'),
});

const selector = (state: RFState) => ({
  getPageType: state.getPageType,
});

type AppViewStudyViewExpertViewModalProviderComponentCameraModalComponentProps = Readonly<{
  category: 'Caméra interieure' | 'Caméra exterieure' | 'Dôme motorisé';
}>;

export default function AppViewStudyViewExpertViewModalProviderComponentCameraModalComponent({
  category,
}: AppViewStudyViewExpertViewModalProviderComponentCameraModalComponentProps) {
  const { getPageType } = useStore(useShallow(selector));
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const { setModal } = useContext(ExpertStudyContext)!;

  const { getValues, setValue, control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      models: [],
    },
  });

  const { data: products } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) =>
      products
        .filter((product) => product.category === category && !!product.reference && includedProducts.includes(product.reference))
        .sort((a, b) => includedProducts.indexOf(a.reference!) - includedProducts.indexOf(b.reference!)),
  });

  const onClose = () => {
    setModal(undefined);
  };

  const onSubmit = ({ models }: yup.InferType<typeof yupSchema>) => {
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
      products
        .map((product) => ({
          product,
          selected: models.find((model) => model.product.id === product.id)?.selected ?? false,
          data: (() => {
            const identification = product.specificationProducts?.find((spec) => spec.specification?.name === 'IDENTIFICATION');
            const plaque = product.specificationProducts?.find((spec) => spec.specification?.name === 'LECTURE DE PLAQUE');
            const reconnaissance = product.specificationProducts?.find((spec) => spec.specification?.name === 'RECONNAISSANCE');

            return {
              bestSeller: !!product.reference && bestSellers.includes(product.reference),
              identification: (identification?.value || identification?.maxValue) ?? 0,
              plaque: (plaque?.value || plaque?.maxValue) ?? 0,
              reconnaissance: (reconnaissance?.value || reconnaissance?.maxValue) ?? 0,
              pir: product.specificationProducts?.find((spec) => spec.specification?.name === 'PIR')?.value ?? undefined,
            };
          })(),
        }))
        .filter((model) => !!model.data.identification && !!model.data.plaque && !!model.data.reconnaissance),
    );
  }, [products]);

  return (
    <ReactModal
      isOpen
      className="absolute left-2/4 top-2/4 m-auto h-auto w-auto min-w-[70%] max-w-[1000px] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <div className="w-full">
        <h1 className="flex h-8 w-full items-center justify-center rounded-t-md bg-[var(--primary-color)] text-white">Choix de la densité</h1>
        <div className="bg-[#FFFFFF] pb-1">
          <div className="mb-4 ml-4 mr-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="camselection_div xxl:flex-row xxl:gap-x-6 flex flex-col gap-y-10">
                <Controller
                  control={control}
                  name="models"
                  render={({ field: { value, onChange } }) => (
                    <AppViewStudyViewExpertViewModalProviderComponentTableComponent models={value} setModels={onChange} />
                  )}
                />
              </div>
              {category === 'Caméra exterieure' && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="grid w-80 grid-cols-3 place-items-center rounded-md border-2 shadow-md"
                    onClick={() => setModal({ type: ExpertStudyModalType.DOME_CAMERAS })}
                  >
                    <img src={'https://bd.vizeo.eu/6-Photos/DO518HD/DO518HD.jpg'} style={{ width: '70px' }} className="mr-2" />
                    <p className="text-black-700 w-32 text-sm font-bold">{'Dôme Motorisé'}</p>
                    <BiShow className="h-5 w-12 font-bold" />
                  </button>
                </div>
              )}
              <div className="mt-8 flex gap-x-6">
                <div className="flex-1 text-right">
                  <button type="button" className="btn btn-secondary bg-[#F24C52]" onClick={onClose}>
                    Annuler
                  </button>
                </div>
                <div className="flex-1 text-left">
                  <button type="submit" className="camselection_validate_btn btn btn-primary bg-[#31385A]">
                    Valider
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}

export { includedProducts as CAMERAS_INCLUDED_PRODUCTS };
