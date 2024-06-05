import { useCallback } from 'react';
import ReactFlow, { Background, BackgroundVariant, OnConnect, addEdge, useEdgesState, useNodesState } from 'reactflow';
import AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponent from './components/NvrNode/NvrNode';
import AppViewStudyViewAutomaticViewIndependantCameraNode from './components/IndependantCameraNode/IndependantCameraNode';

const nodeTypes = {
  'enregistreur-16': AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponent,
  'enregistreur-4': AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponent,
  'enregistreur-8': AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponent,
  independantNode: AppViewStudyViewAutomaticViewIndependantCameraNode,
};

export default function AppViewStudyViewAutomaticViewFlowComponent() {
  const [nodes, _setNodes, onNodesChange] = useNodesState([
    { id: '1', type: 'enregistreur-16', position: { x: 250, y: 5 }, data: {} },
    { id: '2', type: 'enregistreur-4', position: { x: 100, y: 5 }, data: {} },
    { id: '3', type: 'enregistreur-8', position: { x: 400, y: 5 }, data: {} },
    {
      id: '4',
      type: 'independantNode',
      position: { x: 500, y: 200 },
      data: { model: { camId: '2381587f-6601-46d6-a09b-609613ded3ac', reference: 'DA630HD' }, options: [], name: 'DA630HD' },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds)), [setEdges]);

  return (
    <div className="relative z-20 h-[70vh] w-[100%] rounded-md border-2 border-[#1a192b]">
      <ReactFlow nodeTypes={nodeTypes} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}>
        {/* <Controls showFitView={!state.pdfFile.show} showInteractive={!state.pdfFile.show} showZoom={!state.pdfFile.show} /> */}
        <Background variant={BackgroundVariant.Lines} color="white" />
        {/* <Caption visible={state.finalBucket === 'show'} /> */}
      </ReactFlow>
    </div>
  );
}
