import { Node, NodeProps } from '@xyflow/react';
import classNames from 'classnames';
import AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponent from './components/FieldOfView/FieldOfView';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentMenuComponent from './components/Menu/Menu';

export const isExpertStudyDensityCameraNode = (node: Node): node is ExpertStudyDensityCameraNode => {
  return (
    node.type === 'densityCamera' &&
    'productId' in node.data &&
    typeof node.data.productId === 'string' &&
    'range' in node.data &&
    typeof node.data.range === 'number' &&
    'angle' in node.data &&
    typeof node.data.angle === 'number' &&
    'rotation' in node.data &&
    typeof node.data.rotation === 'number' &&
    'opacity' in node.data &&
    typeof node.data.opacity === 'number' &&
    (!('name' in node.data) || typeof node.data.name === 'string' || node.data.name === undefined)
  );
};

// const polarToCartesian = (distance: number, angleInDegrees: number) => {
//   let angleInRadians = (angleInDegrees * Math.PI) / 180.0;
//   return {
//     x: distance * Math.cos(angleInRadians),
//     y: distance * Math.sin(angleInRadians),
//   };
// };

export type ExpertStudyDensityCameraNode = Node<
  { productId: string; range: number; angle: number; rotation: number; opacity: number; name?: string },
  'densityCamera'
>;
export default function AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponent({
  id,
  selected,
  data,
  positionAbsoluteX,
  positionAbsoluteY,
}: NodeProps<ExpertStudyDensityCameraNode>) {
  const { data: product } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) => products.find((product) => product.id === data.productId),
  });

  if (!product) return;

  const camSpecs = (() => {
    const hAngle = product.specificationProducts?.find((spec) => spec.specification?.name === 'ANGLE H');
    return { hAngle: { value: hAngle?.value ?? 0, min: hAngle?.minValue ?? 0, max: hAngle?.maxValue ?? 0 } };
  })();

  const nodePosition = { x: positionAbsoluteX, y: positionAbsoluteY };

  return (
    <div
    // onClick={onNodeClick}
    >
      <div className="flex justify-center">
        <div className={classNames(selected ? undefined : 'invisible')}>
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
          nodePosition={nodePosition}
        />
      </div>
      {selected && <AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentMenuComponent nodeId={id} camSpecs={camSpecs} />}
    </div>
  );
}
