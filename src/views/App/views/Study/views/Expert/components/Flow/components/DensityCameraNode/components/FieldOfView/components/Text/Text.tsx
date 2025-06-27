import ProductResponseDto from '../../../../../../../../../../../../../../utils/types/ProductResponseDto';

type AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentTextComponentProps = Readonly<{
  product: ProductResponseDto;
  name: string;
  maxRange: number;
  svgHeight: number;
  rotation: number;
}>;
export default function AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentTextComponent({
  product,
  name,
  maxRange,
  svgHeight,
  rotation,
}: AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentTextComponentProps) {
  if (!product.reference) return;

  const text = name ? `${name} (${product.reference})` : product.reference;
  const fontSize = Math.min(25, Math.round((maxRange / text.length) * 1.3));
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
      {text}
    </text>
  );
}
