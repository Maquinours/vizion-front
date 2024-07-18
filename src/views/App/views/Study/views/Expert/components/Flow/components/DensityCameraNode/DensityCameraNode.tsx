import { Node, NodeProps } from '@xyflow/react';
import classNames from 'classnames';
import AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponent from './components/FieldOfView/FieldOfView';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentMenuComponent from './components/Menu/Menu';

// const polarToCartesian = (distance: number, angleInDegrees: number) => {
//   let angleInRadians = (angleInDegrees * Math.PI) / 180.0;
//   return {
//     x: distance * Math.cos(angleInRadians),
//     y: distance * Math.sin(angleInRadians),
//   };
// };

export type ExpertStudyDensityCameraNode = Node<{ productId: string; range: number; angle: number; rotation: number; opacity: number, name: string }, 'densityCamera'>;
export default function AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponent({ id, selected, data }: NodeProps<ExpertStudyDensityCameraNode>) {
  //   const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: product } = useSuspenseQuery({ ...queries.product.list, select: (products) => products.find((product) => product.id === data.productId) });

  //   const { angle, identification, plaque, reconnaissance } = (() => {
  //     const angle = product?.specificationProducts?.find((spec) => spec.specification?.name === 'ANGLE H');
  //     const identification = product?.specificationProducts?.find((spec) => spec.specification?.name === 'IDENTIFICATION');
  //     const plaque = product?.specificationProducts?.find((spec) => spec.specification?.name === 'LECTURE DE PLAQUE');
  //     const reconnaissance = product?.specificationProducts?.find((spec) => spec.specification?.name === 'RECONNAISSANCE');
  //     return {
  //       angle: (angle?.value || angle?.maxValue) ?? 0,
  //       identification: (identification?.value || identification?.maxValue) ?? 0,
  //       plaque: (plaque?.value || plaque?.maxValue) ?? 0,
  //       reconnaissance: (reconnaissance?.value || reconnaissance?.maxValue) ?? 0,
  //     };
  //   })();

  if (!product) return;

  const camSpecs = (() => {
    const hAngle = product.specificationProducts?.find((spec) => spec.specification?.name === 'ANGLE H');
    return { hAngle: { value: hAngle?.value ?? 0, min: hAngle?.minValue ?? 0, max: hAngle?.maxValue ?? 0 } };
  })();

  return (
    <div
    // onClick={onNodeClick}
    >
      <div className="flex justify-center">
        <div
          className={classNames(selected ? 'invisible' : undefined)}
          style={{
            pointerEvents: selected // && !isLineDrawing
              ? 'all'
              : 'none',
          }}
        >
          <div className="flex h-[80px] w-[80px] items-center justify-center">
            <div className="text-center text-xs">{product.reference}</div>
          </div>
        </div>
      </div>
      <div className="relative z-0">
        <AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponent
          nodeId={id}
          data={data}
          selected={selected ?? false}
          product={product}
        />
      </div>
      {selected && <AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentMenuComponent nodeId={id} camSpecs={camSpecs} />}
    </div>
  );
}
