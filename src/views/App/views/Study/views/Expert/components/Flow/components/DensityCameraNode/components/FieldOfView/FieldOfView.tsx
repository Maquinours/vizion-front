import { ReactFlowState, useStore as useFlowStore } from '@xyflow/react';
import { isEqual } from 'lodash';
import { intersect, shape } from 'svg-intersections';
import { useShallow } from 'zustand/react/shallow';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import useStore, { RFState } from '../../../../utils/store';
import { ExpertStudyLinesNode } from '../../../LinesNode/LinesNode';
import { ExpertStudyDensityCameraNode } from '../../DensityCameraNode';
import AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentArcComponent from './components/Arc/Arc';
import AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentTextComponent from './components/Text/Text';
import polarToCartesian from './utils/functions/polarToCartesian';
import { useContext } from 'react';
import ExpertStudyContext from '../../../../../../utils/context';

const types: Array<'recognition' | 'reading' | 'identification' | 'full'> = ['recognition', 'reading', 'identification', 'full'];

const calculateRotation = (cx: number, cy: number, x: number, y: number, angle: number) => {
  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (y - cy) + cx,
    ny = cos * (y - cy) - sin * (x - cx) + cy;
  return { x: nx, y: ny };
};

const isSvgIn = (
  firstLine: { x: number; y: number },
  secondLine: { x: number; y: number },
  lineToCheck: { x1: number; y1: number; x2: number; y2: number },
) => {
  const pente1 = firstLine.y / -firstLine.x;
  const pente2 = secondLine.y / -secondLine.x;

  const y1 = pente1 * (-lineToCheck.x1 - -firstLine.x) + firstLine.y;
  const y2 = pente2 * (-lineToCheck.x1 - -secondLine.x) + secondLine.y;
  const y3 = pente1 * (-lineToCheck.x2 - -firstLine.x) + firstLine.y;
  const y4 = pente2 * (-lineToCheck.x2 - -secondLine.x) + secondLine.y;

  return lineToCheck.y1 > y1 && lineToCheck.y1 < y2 && lineToCheck.y2 > y3 && lineToCheck.y2 < y4;
};

const selector = (state: RFState) => {
  const page = state.pages[state.currentPage];
  const scale = page?.type === 'density' ? page.scale : undefined;
  return {
    scale: scale ? scale.virtual / scale.real : undefined,
  };
};

const flowSelector = (state: ReactFlowState) => ({
  obstacles: state.nodes
    .filter((node): node is ExpertStudyLinesNode => node.type === 'lines' && !!((node as ExpertStudyLinesNode).data.obstacle ?? true))
    .map((node) =>
      node.data.positions
        .map((position, index, arr) => {
          if (index === 0) return;
          const previousPosition = arr[index - 1];
          return {
            x1: node.position.x + previousPosition.x,
            y1: node.position.y + previousPosition.y - 8,
            x2: node.position.x + position.x,
            y2: node.position.y + position.y - 8,
          };
        })
        .filter((obstacle): obstacle is { x1: number; y1: number; x2: number; y2: number } => !!obstacle),
    )
    .flat(),
});

type AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentProps = Readonly<{
  data: ExpertStudyDensityCameraNode['data'];
  nodeId: string;
  selected: boolean;
  product: ProductResponseDto;
  nodePosition: { x: number; y: number };
}>;
export default function AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponent({
  data,
  nodeId,
  selected,
  product,
  nodePosition,
}: AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentProps) {
  const { scale } = useStore(useShallow(selector));
  const { obstacles } = useFlowStore(flowSelector, (a, b) => isEqual(a, b));
  const { paneClickFunction } = useContext(ExpertStudyContext)!;

  if (!scale) return;

  const camSpecs = (() => {
    const hAngle = product.specificationProducts?.find((spec) => spec.specification?.name === 'ANGLE H');
    const recognition = product.specificationProducts?.find((spec) => spec.specification?.name === 'RECONNAISSANCE');
    const reading = product.specificationProducts?.find((spec) => spec.specification?.name === 'LECTURE DE PLAQUE');
    const identification = product.specificationProducts?.find((spec) => spec.specification?.name === 'IDENTIFICATION');
    const pir = product.specificationProducts?.find((spec) => spec.specification?.name === 'PIR');
    return {
      hAngle: { value: hAngle?.value ?? 0, min: hAngle?.minValue ?? 0, max: hAngle?.maxValue ?? 0 },
      recognition: { value: recognition?.value ?? 0, min: recognition?.minValue ?? 0, max: recognition?.maxValue ?? 0 },
      reading: { value: reading?.value ?? 0, min: reading?.minValue ?? 0, max: reading?.maxValue ?? 0 },
      identification: { value: identification?.value ?? 0, min: identification?.minValue ?? 0, max: identification?.maxValue ?? 0 },
      pir: pir?.value ?? undefined,
    };
  })();

  const maxRange = scale * data.range;

  const svgHeight = polarToCartesian(maxRange, -data.angle / 2).y - polarToCartesian(maxRange, data.angle / 2).y;

  const masks = (() => {
    const fovPosition = { x: nodePosition.x + 80, y: nodePosition.y + 36 };

    const result: Array<string> = [];
    for (const line of obstacles) {
      const pos = calculateRotation(-40, 0, line.x1 - fovPosition.x, line.y1 - fovPosition.y, data.rotation);
      const pos2 = calculateRotation(-40, 0, line.x2 - fovPosition.x, line.y2 - fovPosition.y, data.rotation);
      const realPos = structuredClone(pos);
      const realPos2 = structuredClone(pos2);
      if (pos.x < 0) {
        const linePente = (pos2.y - pos.y) / (-pos2.x - -pos.x);
        pos.y = pos.y - linePente * -pos.x;
        pos.x = 0;
      }
      if (pos2.x < 0) {
        const linePente = (pos2.y - pos.y) / (-pos2.x - -pos.x);
        pos2.y = pos2.y - linePente * -pos2.x;
        pos2.x = 0;
      }

      const pente = pos.y / -pos.x;
      const pente2 = pos2.y / -pos2.x;

      const arcStart = polarToCartesian(maxRange, -data.angle / 2);
      const arcEnd = polarToCartesian(maxRange, data.angle / 2);

      if (
        intersect(
          shape('path', {
            d: `
        M0,0
            L${arcStart.x},${arcStart.y}
            A${maxRange},${maxRange},0,${data.angle <= 180 ? '0' : '1'},1,${arcEnd.x},${arcEnd.y}
            Z`,
          }),
          shape('line', {
            x1: -realPos.x,
            y1: realPos.y,
            x2: -realPos2.x,
            y2: realPos2.y,
          }),
        ).points.length === 0 &&
        !isSvgIn(arcEnd, arcStart, {
          x1: -realPos.x,
          y1: realPos.y,
          x2: -realPos2.x,
          y2: realPos2.y,
        })
      )
        continue;
      result.push(`
        M${-realPos.x},${realPos.y}
        L${-(maxRange + 3)},${Math.abs(pente) === Infinity ? -svgHeight * Math.sign(pente) : pente * -(maxRange + 3)}
        L${-(maxRange + 3)},${Math.abs(pente2) === Infinity ? -svgHeight * Math.sign(pente2) : pente2 * -(maxRange + 3)}
        L${-realPos2.x},${realPos2.y}
        `);
    }
    return result;
  })();

  const maskId = `${nodeId}-mask`;

  return (
    <svg
      id="test"
      xmlns="http://www.w3.org/2000/svg"
      height={svgHeight}
      width={maxRange + 4}
      className={`absolute`}
      transform={`translate(80 ${-(svgHeight / 2 + 36)}) rotate(${data.rotation}, ${-40 - maxRange / 2}, 0)`}
      style={{ opacity: data.opacity / 100 }}
    >
      <defs>
        <mask id={maskId}>
          <g transform="scale(-1, 1)">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {masks.map((mask, index) => (
              <path key={index} transform={`translate(0, ${svgHeight / 2}) scale(-1, 1)`} d={mask} fill="black" />
            ))}
          </g>
        </mask>
      </defs>
      <g transform={`scale(-1, 1)`} mask={`url(#${maskId})`}>
        {types.map((type) => (
          <AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentArcComponent
            key={type}
            type={type}
            maxRangeInMeter={data.range}
            scale={scale}
            angle={data.angle}
            selected={selected}
            nodeId={nodeId}
            svgHeight={svgHeight}
            camSpecs={camSpecs}
            clickable={!paneClickFunction}
          />
        ))}
      </g>
      {!selected && (
        <AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentTextComponent
          product={product}
          maxRange={maxRange}
          svgHeight={svgHeight}
          rotation={data.rotation}
        />
      )}
    </svg>
  );
}
