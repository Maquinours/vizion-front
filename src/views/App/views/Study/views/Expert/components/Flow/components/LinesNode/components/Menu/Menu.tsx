import { ClickAwayListener } from '@mui/material';
import { NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import { Property } from 'csstype';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useStore, { RFState } from '../../../../utils/store';
import { ExpertStudyLinesNode } from '../../LinesNode';
import classNames from 'classnames';

const PRESET_COLORS: Array<Property.BackgroundColor> = [
  'black',
  'silver',
  'gray',
  'maroon',
  'red',
  'purple',
  'fuchsia',
  'green',
  'lime',
  'olive',
  'yellow',
  'navy',
  'blue',
  'teal',
  'aqua',
];

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

  const color = data.color ?? 'black';
  const dasharray = data.dasharray ?? 4;
  const obstacle = data.obstacle ?? true;

  const yPosition = useMemo(() => {
    const flowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
    const flowCenterY = flowRect.height / 2;
    if (position.top >= flowCenterY) return Position.Top;
    return Position.Bottom;
  }, [position.top]);

  const onChangeColor = (color: string) => {
    updateNodeData(nodeId, { ...data, color });
  };

  const onChangeDasharray = () => {
    updateNodeData(nodeId, { ...data, dasharray: dasharray ? 0 : 4 });
  };

  const onChangeObstacle = () => {
    updateNodeData(nodeId, { ...data, obstacle: !obstacle });
  };

  return (
    <NodeToolbar
      isVisible
      style={{ transform: `translate(${position.left}px, ${position.top}px) translate(0%, ${yPosition === Position.Top ? '-100%' : '0%'})`, zIndex: 1 }}
      className="nopan nodrag max-w-64 rounded-md border border-black bg-white text-center"
    >
      <ClickAwayListener mouseEvent="onPointerDown" onClickAway={onClose}>
        <div className="flex flex-col p-1">
          <div className="flex flex-col gap-y-2 border-b border-black py-2">
            <span>Couleur :</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={classNames('h-6 w-6 rounded-md', {
                    'border-2 border-black': color === presetColor,
                  })}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => onChangeColor(presetColor)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-x-1 py-2">
            <label htmlFor="dasharray">Pointillés :</label>
            <input type="checkbox" id="dasharray" checked={!!dasharray} readOnly onClick={onChangeDasharray} />
          </div>
          {pageType === 'density' && (
            <div className="flex justify-center gap-x-1 border-t border-black py-2">
              <label htmlFor="obstacle">Obstacle :</label>
              <input type="checkbox" id="obstacle" checked={obstacle} readOnly onClick={onChangeObstacle} />
            </div>
          )}
        </div>
      </ClickAwayListener>
    </NodeToolbar>
  );
}
