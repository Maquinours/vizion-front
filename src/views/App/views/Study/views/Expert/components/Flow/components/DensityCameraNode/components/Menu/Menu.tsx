import { NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineDrag } from 'react-icons/ai';
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

  const [isMounted, setIsMounted] = useState(false);

  const dragButtonRef = useRef<HTMLButtonElement>(null);
  const angleButtonRef = useRef<HTMLButtonElement>(null);
  const rangeButtonRef = useRef<HTMLButtonElement>(null);
  const rotationButtonRef = useRef<HTMLButtonElement>(null);
  const opacityButtonRef = useRef<HTMLButtonElement>(null);

  const isVarifocal = camSpecs.hAngle.value === 0 && camSpecs.hAngle.min !== 0 && camSpecs.hAngle.max !== 0;

  const [position, setPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;
    if (dragButtonRef.current) {
      const dragSelection = select(dragButtonRef.current);
      let lastMousePosition = { x: 0, y: 0 };
      dragSelection.on('mousedown', (evt) => {
        lastMousePosition = { x: evt.x, y: evt.y };
      });
      const dragDragHandler = drag<HTMLButtonElement, unknown>().on('drag', (evt) => {
        setPosition(({ left, top }) => {
          const newPosition = {
            left: left + evt.sourceEvent.clientX - lastMousePosition.x,
            top: top + evt.sourceEvent.clientY - lastMousePosition.y,
          };
          lastMousePosition = { x: evt.sourceEvent.clientX, y: evt.sourceEvent.clientY };
          return newPosition;
        });
      });
      dragSelection.call(dragDragHandler);
    }
    if (angleButtonRef.current) {
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
    if (rangeButtonRef.current) {
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
    if (rotationButtonRef.current) {
      const rotationSelection = select(rotationButtonRef.current);
      const rotationDragHandler = drag<HTMLButtonElement, unknown>().on('drag', (evt) => {
        if (!rotationButtonRef.current) return;
        const buttonRect = rotationButtonRef.current.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        const rad = Math.atan2(evt.sourceEvent.clientY - buttonCenterY, evt.sourceEvent.clientX - buttonCenterX);
        const deg = rad * (180 / Math.PI);
        updateNodeData(nodeId, { rotation: deg });
      });
      rotationSelection.call(rotationDragHandler);
    }
    if (opacityButtonRef.current) {
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
  }, [nodeId, isMounted]);

  useEffect(() => {
    const nodeToolbar = document.getElementById(`nodetoolbar-${nodeId}`);
    if (!nodeToolbar) return;
    const flow = document.querySelector('.react-flow');
    if (!flow) return;
    const nodeRect = nodeToolbar.getBoundingClientRect();
    const flowRect = flow.getBoundingClientRect();
    const position = { left: 0, top: 0 };
    if (nodeRect.left < flowRect.left) position.left = flowRect.left - nodeRect.left;
    else if (nodeRect.right > flowRect.right) position.left = flowRect.right - nodeRect.right;
    if (nodeRect.top < flowRect.top) position.top = flowRect.top - nodeRect.top;
    else if (nodeRect.bottom > flowRect.bottom) position.top = flowRect.bottom - nodeRect.bottom;
    setPosition(position);
  }, []);

  return (
    <NodeToolbar
      id={`nodetoolbar-${nodeId}`}
      position={Position.Bottom}
      align="center"
      className="nodrag nopan"
      style={{ left: position.left, top: position.top }}
    >
      <div className="flex h-fit w-fit flex-col rounded-md bg-green-400">
        <button ref={dragButtonRef} title="Déplacer le menu">
          <AiOutlineDrag size={36} />
        </button>
        {isVarifocal && (
          <button ref={angleButtonRef} title="Régler l'angle de la caméra">
            <AngleLogo width={36} height={36} />
          </button>
        )}
        <button ref={rangeButtonRef} title="Régler la distance de vue de la caméra">
          <RangeLogo width={36} height={36} />
        </button>
        <button ref={rotationButtonRef} title="Régler la rotation de la caméra">
          <RotationLogo width={36} height={36} />
        </button>
        <button ref={opacityButtonRef} title="Régler l'opacité">
          <OpacityLogo width={36} height={36} />
        </button>
      </div>
    </NodeToolbar>
  );
}
