import { Node, NodeProps, NodeResizeControl, OnResize, Position, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { useEffect, useRef } from 'react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';
import { OnValueChange } from 'react-number-format';
import useStore, { RFState } from '../../utils/store';
import { useShallow } from 'zustand/react/shallow';

export const isExpertStudyDensityScaleNode = (node: Node): node is ExpertStudyDensityScaleNode => {
  return node.type === 'densityScale' && 'rotation' in node.data && typeof node.data.rotation === 'number';
};

const selector = (state: RFState) => {
  const page = state.pages[state.currentPage];
  return {
    scale: page.type === 'density' ? page.scale : undefined,
    setPageScale: state.setPageScale,
  };
};

export type ExpertStudyDensityScaleNode = Node<
  {
    rotation: number;
  },
  'densityScale'
>;
export default function AppViewStudyViewExpertViewFlowComponentDensityScaleNodeComponent({ id, selected, data }: NodeProps<ExpertStudyDensityScaleNode>) {
  const { updateNodeData } = useReactFlow();
  const { scale, setPageScale } = useStore(useShallow(selector));

  const updateNodeInternals = useUpdateNodeInternals();

  const rotateControlRef = useRef<HTMLDivElement>(null);

  const onResize: OnResize = (_e, params) => {
    setPageScale({ virtual: params.width });
  };

  const onChangeRealWidth: OnValueChange = (values) => {
    setPageScale({ real: Number(values.value) });
  };

  useEffect(() => {
    if (!rotateControlRef.current) return;

    const selection = select(rotateControlRef.current);
    const dragHandler = drag<HTMLDivElement, unknown>().on('drag', (evt) => {
      const dx = evt.x - 100;
      const dy = evt.y - 100;
      const rad = Math.atan2(dx, dy);
      const deg = rad * (180 / Math.PI);
      updateNodeData(id, { rotation: 180 - deg });
      updateNodeInternals(id);
    });

    selection.call(dragHandler);
  }, [id, updateNodeInternals]);

  if (!scale) return;

  return (
    <div id="calibreNode" style={{ transform: `rotate(${data.rotation}deg)`, width: scale.virtual }}>
      <NodeResizeControl
        className="calibreNode-virtual"
        position={Position.Right}
        // onResizeStart={saveCurrentState}
        onResize={onResize}
        style={{ width: 8, height: 8, borderRadius: '100%', top: 'calc(100% - 1.5px)' }}
      />
      <div
        id="calibreNode-rotator"
        ref={rotateControlRef}
        className="nodrag absolute -top-8 left-2/4 h-2.5 w-2.5 translate-x-[-50%] translate-y-[-50%] cursor-alias rounded-[100%] bg-[#3367d9] after:absolute after:left-1 after:top-1 after:block after:h-8 after:w-px after:bg-[#3367d9] after:content-['']"
        style={{ display: selected ? 'block' : 'none' }}
      />
      <div className="flex flex-col items-center">
        <div id="calibreNode-real" className="flex-1 bg-[#FBFCFE]">
          <AmountFormat
            value={scale.real}
            displayType="input"
            suffix="m"
            onValueChange={onChangeRealWidth}
            decimalScale={2}
            className="w-full bg-transparent text-center"
          />
        </div>
        <svg id="calibreNode-line" height={3} width={scale.virtual}>
          <line x1={0} y1={1.5} x2={scale.virtual} y2={1.5} stroke="black" strokeWidth={3} />
        </svg>
      </div>
    </div>
  );
}
