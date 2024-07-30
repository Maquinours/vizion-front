import { NodeToolbar, useReactFlow } from '@xyflow/react';
import { HexColorPicker } from 'react-colorful';
import { ExpertStudyLinesNode } from '../../LinesNode';
import useStore, { RFState } from '../../../../utils/store';
import { useShallow } from 'zustand/react/shallow';
import { ClickAwayListener } from '@mui/material';

const selector = (state: RFState) => ({
  pageType: state.pages[state.currentPage]?.type,
});

type AppViewStudyViewExpertViewFlowComponentLinesNodeComponentMenuComponentProps = Readonly<{
  position: { top: number; left: number };
  onClose: () => void;
  nodeId: string;
  data: ExpertStudyLinesNode['data'];
}>;
export default function AppViewStudyViewExpertViewFlowComponentLinesNodeComponentMenuComponent({
  position,
  onClose,
  nodeId,
  data,
}: AppViewStudyViewExpertViewFlowComponentLinesNodeComponentMenuComponentProps) {
  const { updateNodeData } = useReactFlow();

  const { pageType } = useStore(useShallow(selector));

  const color = data.color ?? '#000000';
  const dasharray = data.dasharray ?? 4;
  const obstacle = data.obstacle ?? true;

  const onChangeColor = (color: string) => {
    updateNodeData(nodeId, { ...data, color });
  };

  const onChangeDasharray = () => {
    updateNodeData(nodeId, { ...data, dasharray: !!dasharray ? 0 : 4 });
  };

  const onChangeObstacle = () => {
    updateNodeData(nodeId, { ...data, obstacle: !obstacle });
  };

  return (
    <NodeToolbar isVisible style={{ transform: `translate(${position.left}px, ${position.top}px)`, zIndex: 1 }} className="nopan nodrag bg-white text-center">
      <ClickAwayListener mouseEvent="onPointerDown" onClickAway={onClose}>
        <div className="flex flex-col gap-y-1">
          <HexColorPicker onChange={onChangeColor} color={color} />
          <div className="flex justify-center gap-x-1">
            <label htmlFor="dasharray">Pointillés :</label>
            <input type="checkbox" id="dasharray" checked={!!dasharray} readOnly onClick={onChangeDasharray} />
          </div>
          {pageType === 'density' && (
            <div className="flex justify-center gap-x-1">
              <label htmlFor="obstacle">Obstacle :</label>
              <input type="checkbox" id="obstacle" checked={obstacle} readOnly onClick={onChangeObstacle} />
            </div>
          )}
        </div>
      </ClickAwayListener>
    </NodeToolbar>
  );
}
