import { ConnectionMode, Node, NodeChange, ProOptions, ReactFlow, Viewport, useReactFlow } from '@xyflow/react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';
import ExpertStudyContext, { ExpertStudyModalType, ExpertStudyPaneClickFunctionType } from '../../utils/context';
import AppViewStudyViewExpertViewFlowComponentImageNodeComponent from './components/ImageNode/ImageNode';
import AppViewStudyViewExpertViewFlowComponentMonitorNodeComponent from './components/MonitorNode/MonitorNode';
import AppViewStudyViewExpertViewFlowComponentRecorderNodeComponent from './components/RecorderNode/RecorderNode';
import AppViewStudyViewExpertViewFlowComponentRectangleNodeComponent, { ExpertStudyRectangleNode } from './components/RectangleNode/RectangleNode';
import AppViewStudyViewExpertViewFlowComponentRectangleTracingComponent from './components/RectangleTracing/RectangleTracing';
import AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponent from './components/SynopticCameraNode/SynopticCameraNode';
import AppViewStudyViewExpertViewFlowComponentTextNodeComponent from './components/TextNode/TextNode';
import AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponent from './components/TransmitterNode/TransmitterNode';
import useStore, { ExpertStudyNode, RFState } from './utils/store';

import AppViewStudyViewExpertViewFlowComponentCartridgeComponent from './components/Cartridge/Cartridge';
import AppViewStudyViewExpertViewFlowComponentLinesNodeComponent, { ExpertStudyLinesNode } from './components/LinesNode/LinesNode';
import AppViewStudyViewExpertViewFlowComponentLinesTracingComponent from './components/LinesTracing/LinesTracing';

import '@xyflow/react/dist/style.css';
import AppViewStudyViewExpertViewFlowComponentComponentHelperLinesComponent from './components/HelperLines/HelperLines';
import { getHelperLines } from './utils/functions/helperLines';

const nodeTypes = {
  synopticCamera: AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponent,
  monitor: AppViewStudyViewExpertViewFlowComponentMonitorNodeComponent,
  recorder: AppViewStudyViewExpertViewFlowComponentRecorderNodeComponent,
  transmitter: AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponent,
  image: AppViewStudyViewExpertViewFlowComponentImageNodeComponent,
  text: AppViewStudyViewExpertViewFlowComponentTextNodeComponent,
  rectangle: AppViewStudyViewExpertViewFlowComponentRectangleNodeComponent,
  lines: AppViewStudyViewExpertViewFlowComponentLinesNodeComponent,
};

const proOptions: ProOptions = {
  hideAttribution: true,
};

const selector = (state: RFState) => ({
  nodes: state.pages[state.currentPage].nodes,
  edges: state.pages[state.currentPage].edges,
  viewport: state.pages[state.currentPage].viewport,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setViewport: state.setViewport,
});

export default function AppViewStudyViewExpertViewFlowComponent() {
  const { screenToFlowPosition, updateNode, addNodes, getNodes } = useReactFlow();
  const { paneClickFunction, setPaneClickFunction, setModal } = useContext(ExpertStudyContext)!;
  const { nodes, edges, viewport, onNodesChange: onNodesChangeStore, onEdgesChange, onConnect, setViewport } = useStore(useShallow(selector));

  const [helperLines, setHelperLines] = useState<{ vertical?: number; horizontal?: number }>({});

  const title = useMemo(() => {
    switch (paneClickFunction?.type) {
      case ExpertStudyPaneClickFunctionType.TEXT:
        return 'Cliquez pour ajouter du texte';
      case ExpertStudyPaneClickFunctionType.RECTANGLE:
        return 'Cliquez pour tracer un rectangle';
    }
  }, [paneClickFunction]);

  const nodesDraggable = useMemo(() => !paneClickFunction, [paneClickFunction]);
  const elementsSelectable = useMemo(() => !paneClickFunction, [paneClickFunction]);

  const onNodeDragStart = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (event.ctrlKey) {
        updateNode(node.id, { selected: true });
        addNodes({ ...node, id: uuidv4(), selected: false, dragging: false });
      }
    },
    [updateNode, addNodes],
  );

  const onPaneClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      switch (paneClickFunction?.type) {
        case ExpertStudyPaneClickFunctionType.LINES: {
          const { x, y } = { x: event.clientX, y: event.clientY };
          const position = screenToFlowPosition({ x, y });
          if (!paneClickFunction.data)
            setPaneClickFunction({ type: ExpertStudyPaneClickFunctionType.LINES, data: { positions: [position], cursorPosition: position } });
          else {
            setPaneClickFunction({
              type: ExpertStudyPaneClickFunctionType.LINES,
              data: { positions: [...paneClickFunction.data.positions, position], cursorPosition: position },
            });
          }
          break;
        }
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
            const node: ExpertStudyRectangleNode = {
              id: uuidv4(),
              type: 'rectangle',
              position: { x: minPosition.x - 1, y: minPosition.y - 1 },
              data: {
                size: { width: maxPosition.x - minPosition.x + 2, height: maxPosition.y - minPosition.y + 2 },
              },
            };
            addNodes(node);
            setPaneClickFunction(undefined);
          }
          break;
        }
      }
    },
    [addNodes, paneClickFunction, screenToFlowPosition, setPaneClickFunction],
  );

  const onPaneMouseMove = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      switch (paneClickFunction?.type) {
        case ExpertStudyPaneClickFunctionType.LINES: {
          if (paneClickFunction.data) {
            const { x, y } = { x: event.clientX, y: event.clientY };
            const position = screenToFlowPosition({ x, y });
            setPaneClickFunction({
              type: ExpertStudyPaneClickFunctionType.LINES,
              data: { positions: [...paneClickFunction.data.positions], cursorPosition: position },
            });
          }
          break;
        }
        case ExpertStudyPaneClickFunctionType.RECTANGLE: {
          if (paneClickFunction.data) {
            const { x, y } = { x: event.clientX, y: event.clientY };
            const position = screenToFlowPosition({ x, y });
            setPaneClickFunction({
              type: ExpertStudyPaneClickFunctionType.RECTANGLE,
              data: { initialPosition: paneClickFunction.data.initialPosition, cursorPosition: position },
            });
          }
          break;
        }
      }
    },
    [paneClickFunction, screenToFlowPosition, setPaneClickFunction],
  );

  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      switch (paneClickFunction?.type) {
        case ExpertStudyPaneClickFunctionType.LINES: {
          if (paneClickFunction.data) {
            event.preventDefault();
            const positions = paneClickFunction.data.positions;
            if (positions.length !== 0) {
              const minPosition = { x: Math.min(...positions.map((position) => position.x)), y: Math.min(...positions.map((position) => position.y)) };
              const node: ExpertStudyLinesNode = {
                id: uuidv4(),
                type: 'lines',
                position: { x: minPosition.x - 2, y: minPosition.y - 2 },
                data: {
                  positions: positions.map((position) => ({ x: position.x - minPosition.x + 2, y: position.y - minPosition.y + 2 })),
                },
                style: {
                  pointerEvents: 'none',
                },
              };
              addNodes(node);
            }
            setPaneClickFunction(undefined);
          }
          break;
        }
      }
    },
    [addNodes, paneClickFunction, setPaneClickFunction],
  );

  const onViewportChange = useCallback((viewport: Viewport) => setViewport(viewport), [setViewport]);

  const onNodesChange = useCallback(
    (changes: Array<NodeChange<ExpertStudyNode>>) => {
      // reset the helper lines (clear existing lines, if any)
      setHelperLines({});
      if (changes.length === 1 && changes[0].type === 'position' && changes[0].dragging && changes[0].position) {
        const helperLines = getHelperLines(changes[0], getNodes());

        // if we have a helper line, we snap the node to the helper line position
        // this is being done by manipulating the node position inside the change object
        changes[0].position.x = helperLines.snapPosition.x ?? changes[0].position.x;
        changes[0].position.y = helperLines.snapPosition.y ?? changes[0].position.y;
        setHelperLines({ horizontal: helperLines.horizontal, vertical: helperLines.vertical });
      }
      onNodesChangeStore(changes);
    },
    [setHelperLines, onNodesChangeStore, getNodes],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeDragStart={onNodeDragStart}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      onPaneClick={onPaneClick}
      onPaneMouseMove={onPaneMouseMove}
      onPaneContextMenu={onPaneContextMenu}
      title={title}
      nodesDraggable={nodesDraggable}
      elementsSelectable={elementsSelectable}
      proOptions={proOptions}
      viewport={viewport}
      onViewportChange={onViewportChange}
      deleteKeyCode={['Delete', 'Backspace']}
    >
      <AppViewStudyViewExpertViewFlowComponentComponentHelperLinesComponent horizontal={helperLines.horizontal} vertical={helperLines.vertical} />
      <AppViewStudyViewExpertViewFlowComponentCartridgeComponent />
      {(() => {
        switch (paneClickFunction?.type) {
          case ExpertStudyPaneClickFunctionType.RECTANGLE:
            return <AppViewStudyViewExpertViewFlowComponentRectangleTracingComponent />;
          case ExpertStudyPaneClickFunctionType.LINES:
            return <AppViewStudyViewExpertViewFlowComponentLinesTracingComponent />;
        }
      })()}
    </ReactFlow>
  );
}
