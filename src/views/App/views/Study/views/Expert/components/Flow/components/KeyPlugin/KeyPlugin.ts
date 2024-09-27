import { isEdge, useKeyPress, useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';
import { isExpertStudyNode } from '../../utils/store';
import { v4 as uuidv4 } from 'uuid';

export default function AppViewStudyViewExpertViewFlowComponentKeyPluginComponent() {
  const { setNodes, setEdges, getNodes, getEdges, deleteElements, addNodes, addEdges } = useReactFlow();

  const ctrlAPressed = useKeyPress(['Control+KeyQ', 'Meta+KeyQ'], { actInsideInputWithModifier: false });
  const ctrlCPressed = useKeyPress(['Control+KeyC', 'Meta+KeyC'], { actInsideInputWithModifier: false });
  const ctrlXPressed = useKeyPress(['Control+KeyX', 'Meta+KeyX'], { actInsideInputWithModifier: false });
  const ctrlVPressed = useKeyPress(['Control+KeyV', 'Meta+KeyV'], { actInsideInputWithModifier: false });
  // TODO: handle ctrl + v to paste nodes and edges

  useEffect(() => {
    if (ctrlAPressed) {
      setNodes((nodes) => nodes.map((node) => ((node.selectable ?? true) ? { ...node, selected: true } : node)));
      setEdges((edges) => edges.map((edge) => ((edge.selectable ?? true) ? { ...edge, selected: true } : edge)));
    }
  }, [ctrlAPressed]);

  useEffect(() => {
    if (ctrlCPressed) {
      const { nodes, edges } = {
        nodes: getNodes().filter((node) => node.selected),
        edges: getEdges().filter((edge) => edge.selected),
      };
      navigator.clipboard.writeText(JSON.stringify({ nodes, edges })).catch(console.error);
    }
  });

  useEffect(() => {
    if (ctrlXPressed) {
      const { nodes, edges } = {
        nodes: getNodes().filter((node) => node.selected),
        edges: getEdges().filter((edge) => edge.selected),
      };
      navigator.clipboard
        .writeText(JSON.stringify({ nodes, edges }))
        .then(() => {
          deleteElements({ nodes, edges });
        })
        .catch(console.error);
    }
  }, [ctrlXPressed]);

  useEffect(() => {
    if (ctrlVPressed) {
      try {
        navigator.clipboard.readText().then((clipboard) => {
          if (!clipboard) return;
          const parsedJson = JSON.parse(clipboard);
          if (!parsedJson || typeof parsedJson !== 'object') return;
          const nodes = parsedJson.nodes;
          const edges = parsedJson.edges;
          if (!Array.isArray(nodes) || !Array.isArray(edges)) return;
          if (!nodes.every((node: unknown) => isExpertStudyNode(node))) return;
          if (!edges.every((edge: unknown) => isEdge(edge))) return;
          nodes.forEach((node) => {
            const oldNodeId = node.id;
            node.id = uuidv4();
            edges.forEach((edge) => {
              if (edge.source === oldNodeId) edge.source = node.id;
              if (edge.target === oldNodeId) edge.target = node.id;
              edge.id = uuidv4();
            });
          });
          addNodes(nodes);
          addEdges(edges);
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [ctrlVPressed]);

  return null;
}
