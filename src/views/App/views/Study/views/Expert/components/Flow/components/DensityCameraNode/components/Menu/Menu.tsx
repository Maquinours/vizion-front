import { NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { useEffect, useRef } from 'react';
import AngleLogo from '../../../../../../../../../../../../assets/images/angle.svg?react';
import OpacityLogo from '../../../../../../../../../../../../assets/images/opacity.svg?react';
import RangeLogo from '../../../../../../../../../../../../assets/images/range.svg?react';
import RotationLogo from '../../../../../../../../../../../../assets/images/rotation.svg?react';
import { ExpertStudyNode } from '../../../../utils/store';

type AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentMenuComponentProps = Readonly<{
  nodeId: string;
  camSpecs: {
    hAngle: { min: number; max: number; value: number };
  };
}>;
export default function AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentMenuComponent({
  nodeId,
  camSpecs,
}: AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponentMenuComponentProps) {
  const { updateNodeData } = useReactFlow<ExpertStudyNode>();

  const angleButtonRef = useRef<HTMLButtonElement>(null);
  const rangeButtonRef = useRef<HTMLButtonElement>(null);
  const rotationButtonRef = useRef<HTMLButtonElement>(null);
  const opacityButtonRef = useRef<HTMLButtonElement>(null);

  const isVarifocal = camSpecs.hAngle.value === 0 && camSpecs.hAngle.min !== 0 && camSpecs.hAngle.max !== 0;

  useEffect(() => {
    if (!!angleButtonRef.current) {
      const angleSelection = select(angleButtonRef.current);
      const angleDragHandler = drag<HTMLButtonElement, unknown>().on('drag', (evt) => {
        updateNodeData(nodeId, (node) => {
          if (node.type !== 'densityCamera') return {};
          let angle = node.data.angle - evt.dy / 3;
          if (camSpecs.hAngle.value !== 0) {
            if (camSpecs.hAngle.value !== angle) angle = camSpecs.hAngle.value;
          } else if (angle < camSpecs.hAngle.min) angle = camSpecs.hAngle.min;
          else if (angle > camSpecs.hAngle.max) angle = camSpecs.hAngle.max;
          if (angle === node.data.angle) return {};
          return { angle };
        });
      });
      angleSelection.call(angleDragHandler);
    }
    if (!!rangeButtonRef.current) {
      const rangeSelection = select(rangeButtonRef.current);
      const rangeDragHandler = drag<HTMLButtonElement, unknown>().on('drag', (evt) => {
        updateNodeData(nodeId, (node) => {
          if (node.type !== 'densityCamera') return {};
          let range = node.data.range + evt.dx / 2;
          if (range < 5) range = 5;
          if (range === node.data.range) return {};
          return { range };
        });
      });
      rangeSelection.call(rangeDragHandler);
    }
    if (!!rotationButtonRef.current) {
      const rotationSelection = select(rotationButtonRef.current);
      const rotationDragHandler = drag<HTMLButtonElement, unknown>().on('drag', (evt) => {
        const dx = evt.x - evt.subject.x;
        const dy = evt.y - evt.subject.y;
        const rad = Math.atan2(dx, dy);
        const deg = rad * (180 / Math.PI);
        updateNodeData(nodeId, { rotation: 180 - deg });
      });
      rotationSelection.call(rotationDragHandler);
    }
    if (!!opacityButtonRef.current) {
      const opacitySelection = select(opacityButtonRef.current);
      const opacityDragHandler = drag<HTMLButtonElement, unknown>().on('drag', (evt) => {
        updateNodeData(nodeId, (node) => {
          if (node.type !== 'densityCamera') return {};
          let opacity = node.data.opacity - evt.dx / 3;
          if (opacity < 10) opacity = 10;
          if (opacity > 100) opacity = 100;
          if (opacity === node.data.opacity) return {};
          return { opacity };
        });
      });
      opacitySelection.call(opacityDragHandler);
    }
  }, [nodeId]);

  return (
    <NodeToolbar position={Position.Bottom} align="center" className="nodrag nopan">
      <div className="flex h-fit w-fit flex-col rounded-md bg-green-400">
        {isVarifocal && (
          <button ref={angleButtonRef}>
            <AngleLogo width={36} height={36} />
          </button>
        )}
        <button ref={rangeButtonRef}>
          <RangeLogo width={36} height={36} />
        </button>
        <button ref={rotationButtonRef}>
          <RotationLogo width={36} height={36} />
        </button>
        <button ref={opacityButtonRef}>
          <OpacityLogo width={36} height={36} />
        </button>
      </div>
    </NodeToolbar>
  );
}
