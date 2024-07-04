import ReactFlow, { ConnectionMode, useReactFlow } from 'reactflow';
import { useShallow } from 'zustand/react/shallow';
import AppViewStudyViewExpertViewFlowComponentMonitorNodeComponent from './components/MonitorNode/MonitorNode';
import AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponent from './components/SynopticCameraNode/SynopticCameraNode';
import useStore, { RFState } from './utils/store';

import { useContext } from 'react';
import 'reactflow/dist/style.css';
import ExpertStudyContext, { ExpertStudyModalType, ExpertStudyPaneClickFunctionType } from '../../utils/context';
import AppViewStudyViewExpertViewFlowComponentGuideLinesComponent from './components/GuideLines/GuideLines';
import AppViewStudyViewExpertViewFlowComponentImageNodeComponent from './components/ImageNode/ImageNode';
import AppViewStudyViewExpertViewFlowComponentRecorderNodeComponent from './components/RecorderNode/RecorderNode';
import AppViewStudyViewExpertViewFlowComponentTextNodeComponent from './components/TextNode/TextNode';
import AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponent from './components/TransmitterNode/TransmitterNode';

const nodeTypes = {
  synopticCamera: AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponent,
  monitor: AppViewStudyViewExpertViewFlowComponentMonitorNodeComponent,
  recorder: AppViewStudyViewExpertViewFlowComponentRecorderNodeComponent,
  transmitter: AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponent,
  image: AppViewStudyViewExpertViewFlowComponentImageNodeComponent,
  text: AppViewStudyViewExpertViewFlowComponentTextNodeComponent,
};

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export default function AppViewStudyViewExpertViewFlowComponent() {
  const { screenToFlowPosition } = useReactFlow();
  const { paneClickFunction, setModal } = useContext(ExpertStudyContext)!;
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(useShallow(selector));

  const onPaneClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    switch (paneClickFunction?.type) {
      case ExpertStudyPaneClickFunctionType.TEXT: {
        const { x, y } = { x: event.clientX, y: event.clientY };
        const position = screenToFlowPosition({ x, y });
        setModal({ type: ExpertStudyModalType.ADD_TEXT, data: { nodePosition: position } });
        break;
      }
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      onPaneClick={onPaneClick}
      title={paneClickFunction?.type === ExpertStudyPaneClickFunctionType.TEXT ? 'Cliquez pour ajouter du texte' : ''}
      // panOnDrag={paneClickFunction?.type !== ExpertStudyPaneClickFunctionType.TEXT}
      nodesDraggable={paneClickFunction?.type !== ExpertStudyPaneClickFunctionType.TEXT}
      // nodesFocusable={paneClickFunction?.type !== ExpertStudyPaneClickFunctionType.TEXT}
      elementsSelectable={paneClickFunction?.type !== ExpertStudyPaneClickFunctionType.TEXT}
    >
      <AppViewStudyViewExpertViewFlowComponentGuideLinesComponent />
    </ReactFlow>
  );
}
