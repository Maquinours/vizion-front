export default function polarToCartesian(distance: number, angleInDegrees: number) {
  const REFERENCE_ANGLE = -180;
  const angleInRadians = ((REFERENCE_ANGLE + angleInDegrees) * Math.PI) / 180.0;
  return {
    x: distance * Math.cos(angleInRadians),
    y: distance * Math.sin(angleInRadians),
  };
}
