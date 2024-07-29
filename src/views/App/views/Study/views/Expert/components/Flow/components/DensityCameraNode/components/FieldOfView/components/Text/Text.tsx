import ProductResponseDto from '../../../../../../../../../../../../../../utils/types/ProductResponseDto';

type AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentTextComponentProps = Readonly<{
  product: ProductResponseDto;
  maxRange: number;
  svgHeight: number;
  rotation: number;
}>;
export default function AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentTextComponent({
  product,
  maxRange,
  svgHeight,
  rotation,
}: AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentTextComponentProps) {
  if (!product.reference) return;
  const fontSize = Math.min(25, Math.round(maxRange / product.reference.length));
  const position = { x: maxRange / 2, y: Math.floor(svgHeight / 2 + (fontSize / 2) * 0.7) };
  const transform = rotation > 80 && rotation < 270 ? `rotate(180deg) translate(-100%, -100%)` : undefined;

  return (
    <text
      x={position.x}
      y={position.y}
      fill={'grey'}
      style={{
        fontSize: fontSize,
        textAnchor: 'middle',
        fill: 'white',
        stroke: 'black',
        fontWeight: 'bold',
        transform: transform,
      }}
    >
      {product.reference}
    </text>
  );
}
