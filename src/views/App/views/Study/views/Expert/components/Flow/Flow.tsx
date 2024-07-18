import { ConnectionMode, IsValidConnection, NodeChange, NodeTypes, OnNodeDrag, ProOptions, ReactFlow, Viewport, useReactFlow } from '@xyflow/react';
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

import { useQueryClient } from '@tanstack/react-query';
import '@xyflow/react/dist/style.css';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import AppViewStudyViewExpertViewFlowComponentComponentHelperLinesComponent from './components/HelperLines/HelperLines';
import AppViewStudyViewExpertViewFlowComponentKeyPluginComponent from './components/KeyPlugin/KeyPlugin';
import recordersHandlesData from './components/RecorderNode/constants/handles';
import { handlesData as transmitterHandlesData } from './components/TransmitterNode/constants/handles';
import { getHelperLines } from './utils/functions/helperLines';
import AppViewStudyViewExpertViewFlowComponentServiceNodeComponent from './components/ServiceNode/ServiceNode';
import AppViewStudyViewExpertViewFlowComponentDensityScaleNodeComponent from './components/DensityScaleNode/DensityScaleNode';
import AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponent from './components/DensityCameraNode/DensityCameraNode';
import AppViewStudyViewExpertViewFlowComponentBackgroundNodeComponent from './components/BackgroundNode/BackgroundNode';

const nodeTypes: NodeTypes = {
  synopticCamera: AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponent,
  monitor: AppViewStudyViewExpertViewFlowComponentMonitorNodeComponent,
  recorder: AppViewStudyViewExpertViewFlowComponentRecorderNodeComponent,
  transmitter: AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponent,
  service: AppViewStudyViewExpertViewFlowComponentServiceNodeComponent,
  image: AppViewStudyViewExpertViewFlowComponentImageNodeComponent,
  text: AppViewStudyViewExpertViewFlowComponentTextNodeComponent,
  rectangle: AppViewStudyViewExpertViewFlowComponentRectangleNodeComponent,
  lines: AppViewStudyViewExpertViewFlowComponentLinesNodeComponent,
  densityScale: AppViewStudyViewExpertViewFlowComponentDensityScaleNodeComponent,
  densityCamera: AppViewStudyViewExpertViewFlowComponentDensityCameraNodeComponent,
  background: AppViewStudyViewExpertViewFlowComponentBackgroundNodeComponent,
};

const proOptions: ProOptions = {
  hideAttribution: true,
};

const deleteKeyCode = ['Delete', 'Backspace'];
const multiSelectionKeyCode = 'Alt';

const selector = (state: RFState) => ({
  nodes: state.pages[state.currentPage].nodes,
  edges: state.pages[state.currentPage].edges,
  viewport: state.pages[state.currentPage].viewport,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setViewport: state.setViewport,
  getPageType: state.getPageType,
});

export default function AppViewStudyViewExpertViewFlowComponent() {
  const queryClient = useQueryClient();
  const { screenToFlowPosition, addNodes, getNodes, getEdges } = useReactFlow<ExpertStudyNode>();
  const { paneClickFunction, setPaneClickFunction, setModal } = useContext(ExpertStudyContext)!;
  const { nodes, edges, viewport, onNodesChange: onNodesChangeStore, onEdgesChange, onConnect, setViewport, getPageType } = useStore(useShallow(selector));

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

  const onNodeDragStart: OnNodeDrag<ExpertStudyNode> = useCallback(
    (event, node) => {
      if (event.ctrlKey) addNodes({ ...node, id: uuidv4(), selected: false, dragging: false });
    },
    [addNodes],
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
      if (getPageType() === 'synoptic' && changes.length === 1 && changes[0].type === 'position' && changes[0].dragging && changes[0].position) {
        const helperLines = getHelperLines(changes[0], getNodes());

        // if we have a helper line, we snap the node to the helper line position
        // this is being done by manipulating the node position inside the change object
        changes[0].position.x = helperLines.snapPosition.x ?? changes[0].position.x;
        changes[0].position.y = helperLines.snapPosition.y ?? changes[0].position.y;
        setHelperLines({ horizontal: helperLines.horizontal, vertical: helperLines.vertical });
      } else
        for (const change of changes) if (change.type === 'select' && change.selected && change.id === 'background') changes.splice(changes.indexOf(change), 1); // can't select the background node

      onNodesChangeStore(changes);
    },
    [setHelperLines, onNodesChangeStore, getNodes, getPageType],
  );

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      // If one handle is not defined, the connection is invalid
      if (!connection.sourceHandle || !connection.targetHandle) return false;
      // If the two handles are from the same node, the connection is invalid
      if (connection.source === connection.target) return false;

      const edges = getEdges();
      // If one handle is already used by an edge, the connection is invalid
      if (
        edges.some(
          (edge) =>
            (edge.source === connection.source && edge.sourceHandle === connection.sourceHandle) ||
            (edge.source === connection.target && edge.sourceHandle === connection.targetHandle) ||
            (edge.target === connection.source && edge.targetHandle === connection.sourceHandle) ||
            (edge.target === connection.target && edge.targetHandle === connection.targetHandle),
        )
      )
        return false;

      const nodes = getNodes();
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);
      // If we can't find the source or target node, the connection is invalid
      if (!sourceNode || !targetNode) return false;

      if (sourceNode.type === 'synopticCamera' && targetNode.type === 'synopticCamera') return false;

      const getHandlesType = (node: ExpertStudyNode, handleId: string) => {
        switch (node.type) {
          case 'synopticCamera':
            return 'RJ45';
          case 'recorder':
          case 'transmitter': {
            const handlesDataList = node.type === 'recorder' ? recordersHandlesData : node.type === 'transmitter' ? transmitterHandlesData : undefined;
            if (!handlesDataList) throw new Error('Impossible de trouver les handles');
            const product = queryClient
              .getQueryData<Array<ProductResponseDto>>(queries.product.list.queryKey)
              ?.find((product) => product.id === node.data.productId);
            if (!product) throw new Error('Impossible de trouver le produit');
            const handle = handlesDataList.find((handle) => handle.productReference === product.reference)?.handles.find((handle) => handle.id === handleId);
            if (!handle) throw new Error('Impossible de trouver le handle');
            return handle.data.type;
          }
          case 'monitor':
            return 'HDMI';
          default: {
            if (node.type === 'text') return 'RJ45-LAN';
            return 'any';
          }
        }
      };

      const sourceHandleType = getHandlesType(sourceNode, connection.sourceHandle);
      const targetHandleType = getHandlesType(targetNode, connection.targetHandle);

      // If the handles are not compatible, the connection is invalid
      if (
        ![sourceHandleType, targetHandleType].includes('any') &&
        sourceHandleType !== targetHandleType &&
        (sourceHandleType !== 'RJ45' || targetHandleType !== 'RJ45-LAN') &&
        (sourceHandleType !== 'RJ45-LAN' || targetHandleType !== 'RJ45')
      )
        return false;

      return true;
    },
    [getEdges, getNodes, queryClient],
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
      deleteKeyCode={deleteKeyCode}
      multiSelectionKeyCode={multiSelectionKeyCode}
      isValidConnection={isValidConnection}
    >
      <AppViewStudyViewExpertViewFlowComponentComponentHelperLinesComponent horizontal={helperLines.horizontal} vertical={helperLines.vertical} />
      <AppViewStudyViewExpertViewFlowComponentCartridgeComponent />
      <AppViewStudyViewExpertViewFlowComponentKeyPluginComponent />
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
