import { useKeyPress, useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';

export default function AppViewStudyViewExpertViewFlowComponentKeyPluginComponent() {
  const { setNodes, setEdges, getNodes, getEdges, deleteElements } = useReactFlow();

  const ctrlAPressed = useKeyPress(['Control+KeyQ', 'Meta+KeyQ'], { actInsideInputWithModifier: false });
  const ctrlCPressed = useKeyPress(['Control+KeyC', 'Meta+KeyC'], { actInsideInputWithModifier: false });
  const ctrlXPressed = useKeyPress(['Control+KeyX', 'Meta+KeyX'], { actInsideInputWithModifier: false });
  // TODO: handle ctrl + v to paste nodes and edges

  useEffect(() => {
    if (ctrlAPressed) {
      setNodes((nodes) => nodes.map((node) => (node.selectable ?? true ? { ...node, selected: true } : node)));
      setEdges((edges) => edges.map((edge) => (edge.selectable ?? true ? { ...edge, selected: true } : edge)));
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

  return null;
}
