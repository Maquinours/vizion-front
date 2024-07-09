import { Edge, Node, ReactFlowState, Viewport, useReactFlow, useStore } from '@xyflow/react';
import { AutomaticStudyIndependantCameraNode } from '../../../Flow/components/IndependantCameraNode/IndependantCameraNode';
import { AutomaticStudyFinalCameraNode } from '../../../Flow/components/FinalCameraNode/FinalCameraNode';
import { AutomaticStudyStep } from '../../../../Automatic';
import { useState } from 'react';
import AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponent from './components/AddMonitorModal/AddMonitorModal';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import { AutomaticStudyNvrNode } from '../../../Flow/components/NvrNode/NvrNode';
import { AutomaticStudyBoxNode } from '../../../Flow/components/BoxNode/BoxNode';
import { AutomaticStudyFinalMonitorNode } from '../../../Flow/components/FinalMonitorNode/FinalMonitorNode';

enum Modals {
  Monitor,
}

const finalNodeInitialPositionsData = {
  large: {
    initialPosition: {
      top: {
        x: 100,
        y: 240,
      },
      bottom: {
        x: 100,
        y: 360,
      },
    },
    scale: {
      x: 0,
      y: 80,
    },
    width: 80,
    height: 80,
  },
  small: {
    initialPosition: {
      top: {
        x: 100,
        y: 220,
      },
      bottom: {
        x: 100,
        y: 340,
      },
    },
    scale: {
      x: 0,
      y: 30,
    },
    width: 60,
    height: 60,
  },
};

const getHasCameras = (state: ReactFlowState) => Array.from(state.nodeLookup.values()).some((node) => node.type === 'independantNode');

type AppViewStudyViewAutomaticViewFooterComponentStepOneComponentProps = Readonly<{
  setBackupFlow: (flow: { nodes: Array<Node>; edges: Array<Edge>; viewport: Viewport }) => void;
  setStep: (step: AutomaticStudyStep) => void;
}>;
export default function AppViewStudyViewAutomaticViewFooterComponentStepOneComponent({
  setBackupFlow,
  setStep,
}: AppViewStudyViewAutomaticViewFooterComponentStepOneComponentProps) {
  const { getNodes, setNodes, getEdges, setEdges, getViewport } = useReactFlow();

  const hasCameras = useStore(getHasCameras);

  const [openedModal, setOpenedModal] = useState<Modals>();

  const nextStep = (monitor?: { id: string }) => {
    const nodes = getNodes();
    const edges = getEdges();
    const viewport = getViewport();

    setBackupFlow({ nodes, edges, viewport });

    const finalNodes = (() => {
      const cams = nodes
        .filter((node): node is AutomaticStudyIndependantCameraNode => node.type === 'independantNode')
        .map(
          (node, index, arr): AutomaticStudyFinalCameraNode => ({
            id: index.toString(),
            type: 'finalNode',
            position: (() => {
              const data = arr.length < 8 ? finalNodeInitialPositionsData.large : finalNodeInitialPositionsData.small;
              const initialPosition = index % 2 === 0 ? data.initialPosition.top : data.initialPosition.bottom;
              return {
                x: initialPosition.x + data.scale.x * (index % 2 === 0 ? -1 : 1) * (index / 2),
                y: initialPosition.y + data.scale.y * (index % 2 === 0 ? -1 : 1) * (index / 2),
              };
            })(),
            data: {
              options: node.data.options.map((opt) => ({
                qty: opt.qty,
                reference: opt.reference,
              })),
              model: {
                reference: node.data.model.reference,
              },
              width: arr.length < 8 ? 80 : 60,
              height: arr.length < 8 ? 80 : 60,
            },
          }),
        );

      const recorder: AutomaticStudyNvrNode = {
        id: 'enregistreur',
        type: 'nvrNode',
        position: { x: 300, y: 300 },
        draggable: false,
        data: {
          reference: cams.length <= 4 ? 'HD504PAP' : cams.length <= 8 ? 'HD508PAP' : 'HD516PAP',
        },
      };

      const box: AutomaticStudyBoxNode = {
        id: 'box',
        type: 'boxNode',
        position: { x: 500, y: 400 },
        data: {},
      };

      const result: Array<AutomaticStudyFinalCameraNode | AutomaticStudyNvrNode | AutomaticStudyBoxNode | AutomaticStudyFinalMonitorNode> = [
        ...cams,
        recorder,
        box,
      ];

      if (monitor) {
        const tv: AutomaticStudyFinalMonitorNode = {
          id: monitor.id,
          type: 'tvNode',
          position: {
            x: 500,
            y: 200,
          },
          data: {},
        };
        result.push(tv);
      }

      return result;
    })();

    const finalEdges = (() => {
      const cams = finalNodes
        .filter((node): node is AutomaticStudyFinalCameraNode => node.type === 'finalNode')
        .map(
          (node, index): Edge => ({
            id: index.toString(),
            source: node.id,
            sourceHandle: 'x',
            target: 'enregistreur',
            targetHandle: (index + 1).toString(),
            type: 'smoothstep',
            style: {
              stroke: 'black',
            },
          }),
        );

      const box = {
        id: 'box__enregistreur',
        source: 'box',
        sourceHandle: 'x',
        target: 'enregistreur',
        targetHandle: 'v45',
        type: 'smoothstep',
        style: {
          stroke: 'black',
        },
        zIndex: 10,
      };

      const result = [...cams, box];

      const finalTvNode = finalNodes.find((node) => node.type === 'tvNode');
      if (finalTvNode) {
        const tv = {
          id: 'tv__enregistreur',
          source: finalTvNode.id,
          sourceHandle: 'x',
          target: 'enregistreur',
          targetHandle: 'tv',
          type: 'smoothstep',
          style: {
            stroke: 'blue',
          },
          zIndex: 10,
        };
        result.push(tv);
      }

      return result;
    })();

    setNodes(finalNodes);
    setEdges(finalEdges);
    setStep(AutomaticStudyStep.Two);
  };

  const verifyConfiguration = () => {
    const nodes = getNodes();

    // If there is no TV node
    const tvNode = nodes.find((node) => node.type === 'automatiqueTvNode');
    if (!tvNode) setOpenedModal(Modals.Monitor);
    else nextStep({ id: tvNode.id });
  };

  return (
    <>
      <button disabled={!hasCameras} className="btn btn-secondary" onClick={() => verifyConfiguration()}>
        Vérifier la configuration
      </button>
      {openedModal === Modals.Monitor && (
        <AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponent
          onClose={() => setOpenedModal(undefined)}
          onSubmit={({ monitor }: { monitor?: ProductResponseDto }) => {
            setOpenedModal(undefined);
            nextStep(monitor);
          }}
        />
      )}
    </>
  );
}
