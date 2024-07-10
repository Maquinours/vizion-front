import { Handle, Node, NodeProps, NodeResizer, OnResize, Position, ReactFlowState, useReactFlow, useStore } from '@xyflow/react';

const handlesData = [
  {
    id: '1',
    style: { width: '90%', height: '10%', top: 0, background: 'transparent', border: 0 },
    position: Position.Top,
  },
  {
    id: '2',
    style: { width: '90%', height: '10%', bottom: 0, background: 'transparent', border: 0 },
    position: Position.Bottom,
  },
  {
    id: '3',
    style: { width: '10%', height: '90%', left: 0, background: 'transparent', border: 0 },
    position: Position.Left,
  },
  {
    id: '4',
    style: { width: '10%', height: '90%', right: 0, background: 'transparent', border: 0 },
    position: Position.Right,
  },
];

const getIsConnectable = (state: ReactFlowState) => {
  return state.connection.inProgress;
};

export type ExpertStudyRectangleNode = Node<
  {
    size: { width: number; height: number };
  },
  'rectangle'
>;
export default function AppViewStudyViewExpertViewFlowComponentRectangleNodeComponent({ id, selected, data }: NodeProps<ExpertStudyRectangleNode>) {
  const { updateNodeData } = useReactFlow();
  const isConnectable = useStore(getIsConnectable);

  const onResize: OnResize = (_event, params) => {
    updateNodeData(id, { size: { width: params.width, height: params.height } });
  };

  return (
    <>
      <NodeResizer
        minHeight={20}
        minWidth={20}
        isVisible={selected ?? false}
        onResize={onResize}
        handleStyle={{ width: 10, height: 10, borderRadius: '100%' }}
      />
      {handlesData.map((handle) => (
        <Handle key={handle.id} id={handle.id} position={handle.position} style={handle.style} type="source" isConnectable={isConnectable} />
      ))}
      <svg width={data.size.width} height={data.size.height} className="block">
        <rect x={1} y={1} width={data.size.width - 2} height={data.size.height - 2} stroke="black" fill="transparent" strokeDasharray={4} strokeWidth={2} />
      </svg>
    </>
  );
}
