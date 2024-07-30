import { useMemo } from 'react';
import polarToCartesian from '../../utils/functions/polarToCartesian';
import { classNames } from '@react-pdf-viewer/core';

type AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentArcComponentProps = Readonly<{
  type: 'recognition' | 'reading' | 'identification' | 'full';
  maxRangeInMeter: number;
  angle: number;
  scale: number;
  svgHeight: number;
  selected: boolean;
  nodeId: string;
  camSpecs: {
    hAngle: { min: number; max: number; value: number };
    recognition: { min: number; max: number; value: number };
    reading: { min: number; max: number; value: number };
    identification: { min: number; max: number; value: number };
    pir: number | undefined;
  };
}>;
export default function AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentArcComponent({
  type,
  maxRangeInMeter,
  angle,
  scale,
  svgHeight,
  selected,
  nodeId,
  camSpecs,
}: AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentFieldOfViewComponentArcComponentProps) {
  const realRange = (() => {
    if (type === 'full') return maxRangeInMeter;
    if (camSpecs.hAngle.value) return camSpecs[type].value;
    else {
      const m = (camSpecs[type].max - camSpecs[type].min) / (camSpecs.hAngle.min - camSpecs.hAngle.max);
      const b = camSpecs[type].max - m * camSpecs.hAngle.min;
      return m * angle + b;
    }
  })();

  const meterRangeToShow = Math.min(realRange, maxRangeInMeter);

  const range = meterRangeToShow * scale;

  const arcStart = polarToCartesian(range, -angle / 2);
  const arcEnd = polarToCartesian(range, angle / 2);
  const largeArcFlag = angle <= 180 ? '0' : '1';
  const transform = `translate(0, ${svgHeight / 2})`;

  const className = classNames({
    'drag-handle pointer-events-auto': type === 'full',
  });

  const d = useMemo(
    () => `M0,0
        L${arcStart.x},${arcStart.y}
        A${range},${range},0,${largeArcFlag},1,${arcEnd.x},${arcEnd.y}
        Z`,
    [arcStart?.x, arcStart?.y, range, largeArcFlag, arcEnd?.x, arcEnd?.y],
  );

  const color = (() => {
    switch (type) {
      case 'recognition':
        return '#EAEAEF';
      case 'reading':
        return '#6F7592';
      case 'identification':
        return '#101735';
    }
    return 'transparent';
  })();

  //   const style = useMemo(() => {
  //     return {
  //         pointerEvents: !minResolution && !isLineDrawing ? 'all' : 'none',
  //     };
  // }, [minResolution, isLineDrawing]);

  const stroke = type === 'full' && selected ? 'green' : 'black';
  const strokeWidth = type === 'full' && selected ? 4 : 1;
  const strokeDasharray = type === 'full' && !selected ? 4 : 0;

  const isNotVisibleAtNight = type !== 'full' && typeof camSpecs.pir === 'number' && camSpecs.pir < meterRangeToShow;

  return (
    <>
        <path
          id={`${nodeId}-${type}`}
          className={className}
          transform={transform}
          d={d}
          fill={color}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      {isNotVisibleAtNight && (
        <text x={range - 10} y={8} fill={'orange'} style={{ transform: 'translate(0%, 50%) scaleX(-1)' }}>
          *
        </text>
      )}
    </>
  );
}
