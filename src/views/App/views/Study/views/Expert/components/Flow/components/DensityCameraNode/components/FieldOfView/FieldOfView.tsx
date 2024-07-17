import { useShallow } from 'zustand/react/shallow';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import useStore, { RFState } from '../../../../utils/store';
import { ExpertStudyDensityCameraNode } from '../../DensityCameraNode';
import AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentArcComponent from './components/Arc/Arc';
import polarToCartesian from './utils/functions/polarToCartesian';

const types: Array<'recognition' | 'reading' | 'identification' | 'full'> = ['recognition', 'reading', 'identification', 'full'];

const selector = (state: RFState) => {
  const page = state.pages[state.currentPage];
  const scale = page.type === 'density' ? page.scale : undefined;
  return {
    scale: scale ? scale.virtual / scale.real : undefined,
  };
};

type AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentProps = Readonly<{
  data: ExpertStudyDensityCameraNode['data'];
  nodeId: string;
  selected: boolean;
  product: ProductResponseDto;
}>;
export default function AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponent({
  data,
  nodeId,
  selected,
  product,
}: AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentProps) {
  const { scale } = useStore(useShallow(selector));

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

  // const maskId = `${nodeId}-mask`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={svgHeight}
      width={maxRange + 4}
      className={`absolute`}
      transform={`translate(80 ${-(svgHeight / 2 + 36)}) rotate(${data.rotation}, ${-40 - maxRange / 2}, 0)`}
      style={{ opacity: data.opacity / 100 }}
    >
      {/* <defs>
        {masks.length > 0 && (
          <mask id={maskId}>
            <g transform="scale(-1, 1)">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {masks.map((mask, index) => (
                <path key={index} transform={`translate(0, ${svgHeight / 2}) scale(-1, 1)`} d={mask} fill="black" />
              ))}
            </g>
          </mask>
        )}
      </defs> */}
      <g
        transform={`scale(-1, 1)`}
        // mask={maskId}
      >
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
          />
        ))}
      </g>
      {/* {!selected && <FOVText maxRange={maxRange} SvgHeight={SvgHeight} reference={reference} rotation={rotation} />} */}
    </svg>
  );
}
