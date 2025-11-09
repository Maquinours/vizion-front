import { ClickAwayListener } from '@mui/material';
import { NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import { useMemo } from 'react';
import { FaTrash } from 'react-icons/fa';
import { IoIosLock, IoIosUnlock } from 'react-icons/io';
import { NumberFormatValues, OnValueChange } from 'react-number-format';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import { ExpertStudyBackgroundNode } from '../../BackgroundNode';

const isScaleValueAllowed = ({ floatValue }: NumberFormatValues) => !floatValue || (floatValue >= 0 && floatValue <= 200);
const isOpacityValueAllowed = ({ floatValue }: NumberFormatValues) => !floatValue || (floatValue >= 0 && floatValue <= 100);
const isRotationValueAllowed = ({ floatValue }: NumberFormatValues) => !floatValue || (floatValue >= 0 && floatValue <= 359);

type AppViewStudyViewExpertViewFlowComponentBackgroundNodeComponentMenuComponentProps = Readonly<{
  position: { top: number; left: number };
  nodeId: string;
  draggable: boolean;
  data: ExpertStudyBackgroundNode['data'];
  onClose: () => void;
}>;
export default function AppViewStudyViewExpertViewFlowComponentBackgroundNodeComponentMenuComponent({
  position,
  nodeId,
  draggable,
  data,
  onClose,
}: AppViewStudyViewExpertViewFlowComponentBackgroundNodeComponentMenuComponentProps) {
  const { updateNodeData, updateNode, deleteElements } = useReactFlow();

  const yPosition = useMemo(() => {
    const flowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
    const flowCenterY = flowRect.height / 2;
    if (position.top >= flowCenterY) return Position.Top;
    return Position.Bottom;
  }, [position.top]);

  const onLockButtonClick = () => updateNode(nodeId, { draggable: !draggable });

  const onScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { scale: parseFloat(e.target.value) });
  };

  const onScaleValueChange: OnValueChange = (v, infos) => {
    if (infos.source === 'event') updateNodeData(nodeId, { scale: parseInt(v.value) / 100 || 0 });
  };

  const onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { opacity: parseFloat(e.target.value) });
  };

  const onOpacityValueChange: OnValueChange = (v, infos) => {
    if (infos.source === 'event') updateNodeData(nodeId, { opacity: parseInt(v.value) / 100 || 0 });
  };

  const onRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { rotation: parseFloat(e.target.value) });
  };

  const onRotationValueChange: OnValueChange = (v, infos) => {
    if (infos.source === 'event') updateNodeData(nodeId, { rotation: parseInt(v.value) || 0 });
  };

  const onDeleteButtonClick = () => {
    deleteElements({ nodes: [{ id: nodeId }] });
  };

  return (
    <NodeToolbar
      isVisible
      style={{ transform: `translate(${position.left}px, ${position.top}px) translate(0%, ${yPosition === Position.Top ? '-100%' : '0%'})`, zIndex: 1 }}
      className="nodrag nopan absolute top-0 left-0"
    >
      <ClickAwayListener mouseEvent="onPointerDown" onClickAway={onClose}>
        <div className="flex w-60 flex-col items-center rounded-md border-2 border-black bg-white p-2">
          <button onClick={onLockButtonClick} title={draggable ? 'Bloquer la position du plan' : 'Débloquer la position du plan'} className="w-full">
            {draggable ? <IoIosUnlock size={32} /> : <IoIosLock size={32} />}
          </button>
          <div className="grid grid-cols-3 flex-row gap-x-1 border-t-2 border-black p-1 text-center">
            <label htmlFor="scale-value">Taille :</label>
            <input id="scale-value" type="range" min={0.1} max={2} step={0.01} value={data.scale} onChange={onScaleChange} className="w-full" />
            <AmountFormat
              value={data.scale * 100}
              isAllowed={isScaleValueAllowed}
              displayType="input"
              suffix="%"
              className="w-full text-center"
              decimalScale={0}
              onValueChange={onScaleValueChange}
            />
          </div>
          <div className="grid grid-cols-3 flex-row gap-x-1 border-t-2 border-black p-1 text-center">
            <label htmlFor="opacity-value">Opacité :</label>
            <input id="opacity-value" type="range" min={0.1} max={1} step={0.01} value={data.opacity} onChange={onOpacityChange} className="w-full" />
            <AmountFormat
              value={data.opacity * 100}
              isAllowed={isOpacityValueAllowed}
              displayType="input"
              suffix="%"
              className="w-full text-center"
              decimalScale={0}
              onValueChange={onOpacityValueChange}
            />
          </div>
          <div className="grid grid-cols-3 flex-row gap-x-1 border-t-2 border-black p-1 text-center">
            <label htmlFor="rotation-value">Rotation :</label>
            <input id="rotation-value" type="range" min={0} max={359} step={1} value={data.rotation} onChange={onRotationChange} className="w-full" />
            <AmountFormat
              value={data.rotation}
              isAllowed={isRotationValueAllowed}
              displayType="input"
              suffix="°"
              className="w-full text-center"
              decimalScale={0}
              onValueChange={onRotationValueChange}
            />
          </div>
          <button onClick={onDeleteButtonClick} title="Supprimer le plan" className="w-full border-t-2 border-black p-1">
            <FaTrash size={20} />
          </button>
        </div>
      </ClickAwayListener>
    </NodeToolbar>
  );
}
