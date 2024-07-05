import ReactFlow, { ConnectionMode, Node, useReactFlow } from 'reactflow';
import { useShallow } from 'zustand/react/shallow';
import AppViewStudyViewExpertViewFlowComponentMonitorNodeComponent from './components/MonitorNode/MonitorNode';
import AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponent from './components/SynopticCameraNode/SynopticCameraNode';
import useStore, { RFState } from './utils/store';
import { useContext } from 'react';
import ExpertStudyContext, { ExpertStudyModalType, ExpertStudyPaneClickFunctionType } from '../../utils/context';
import AppViewStudyViewExpertViewFlowComponentGuideLinesComponent from './components/GuideLines/GuideLines';
import AppViewStudyViewExpertViewFlowComponentImageNodeComponent from './components/ImageNode/ImageNode';
import AppViewStudyViewExpertViewFlowComponentRecorderNodeComponent from './components/RecorderNode/RecorderNode';
import AppViewStudyViewExpertViewFlowComponentTextNodeComponent from './components/TextNode/TextNode';
import AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponent from './components/TransmitterNode/TransmitterNode';
import AppViewStudyViewExpertViewFlowComponentRectangleNodeComponent, { ExpertStudyRectangleNodeData } from './components/RectangleNode/RectangleNode';
import AppViewStudyViewExpertViewFlowComponentRectangleTracingComponent from './components/RectangleTracing/RectangleTracing';
import { v4 as uuidv4 } from 'uuid';

import 'reactflow/dist/style.css';

const nodeTypes = {
  synopticCamera: AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponent,
  monitor: AppViewStudyViewExpertViewFlowComponentMonitorNodeComponent,
  recorder: AppViewStudyViewExpertViewFlowComponentRecorderNodeComponent,
  transmitter: AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponent,
  image: AppViewStudyViewExpertViewFlowComponentImageNodeComponent,
  text: AppViewStudyViewExpertViewFlowComponentTextNodeComponent,
  rectangle: AppViewStudyViewExpertViewFlowComponentRectangleNodeComponent,
};

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export default function AppViewStudyViewExpertViewFlowComponent() {
  const { screenToFlowPosition, addNodes } = useReactFlow();
  const { paneClickFunction, setPaneClickFunction, setModal } = useContext(ExpertStudyContext)!;
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(useShallow(selector));

  const onPaneClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    switch (paneClickFunction?.type) {
      case ExpertStudyPaneClickFunctionType.TEXT: {
        const { x, y } = { x: event.clientX, y: event.clientY };
        const position = screenToFlowPosition({ x, y });
        setModal({ type: ExpertStudyModalType.ADD_TEXT, data: { nodePosition: position } });
        break;
      }
      case ExpertStudyPaneClickFunctionType.RECTANGLE: {
        const { x, y } = { x: event.clientX, y: event.clientY };
        const position = screenToFlowPosition({ x, y });
        if (!paneClickFunction.data)
          setPaneClickFunction({ type: ExpertStudyPaneClickFunctionType.RECTANGLE, data: { initialPosition: position, cursorPosition: position } });
        else {
          const { maxPosition, minPosition } = {
            maxPosition: {
              x: Math.max(paneClickFunction.data.initialPosition.x, position.x),
              y: Math.max(paneClickFunction.data.initialPosition.y, position.y),
            },
            minPosition: {
              x: Math.min(paneClickFunction.data.initialPosition.x, position.x),
              y: Math.min(paneClickFunction.data.initialPosition.y, position.y),
            },
          };
          const node: Node<ExpertStudyRectangleNodeData, 'rectangle'> = {
            id: uuidv4(),
            type: 'rectangle',
            position: { x: minPosition.x - 1, y: minPosition.y - 1 },
            data: {
              size: { width: maxPosition.x - minPosition.x + 2, height: maxPosition.y - minPosition.y + 2 },
            },
          };
          addNodes([node]);
          setPaneClickFunction(undefined);
        }
        break;
      }
    }
  };

  const onPaneMouseMove = (event: React.MouseEvent<Element, MouseEvent>) => {
    if (paneClickFunction?.type === ExpertStudyPaneClickFunctionType.RECTANGLE && paneClickFunction.data) {
      const { x, y } = { x: event.clientX, y: event.clientY };
      const position = screenToFlowPosition({ x, y });
      setPaneClickFunction({
        type: ExpertStudyPaneClickFunctionType.RECTANGLE,
        data: { initialPosition: paneClickFunction.data.initialPosition, cursorPosition: position },
      });
    }
  };

  const title = (() => {
    switch (paneClickFunction?.type) {
      case ExpertStudyPaneClickFunctionType.TEXT:
        return 'Cliquez pour ajouter du texte';
      case ExpertStudyPaneClickFunctionType.RECTANGLE:
        return 'Cliquez pour tracer un rectangle';
    }
  })();

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
      onPaneMouseMove={onPaneMouseMove}
      title={title}
      nodesDraggable={!paneClickFunction}
      elementsSelectable={!paneClickFunction}
    >
      <AppViewStudyViewExpertViewFlowComponentGuideLinesComponent />
      {paneClickFunction?.type === ExpertStudyPaneClickFunctionType.RECTANGLE && <AppViewStudyViewExpertViewFlowComponentRectangleTracingComponent />}
    </ReactFlow>
  );
}
