import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { PiRectangle, PiTextT } from 'react-icons/pi';
import { Node, useReactFlow } from 'reactflow';
import LinesLogo from '../../../../../../../../assets/images/lines.svg?react';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ExpertStudyContext, { ExpertStudyModalType, ExpertStudyPaneClickFunctionType } from '../../utils/context';
import { AppViewStudyViewExpertViewFlowComponentRecorderNodeComponentData } from '../Flow/components/RecorderNode/RecorderNode';
import recordersHandlesData from '../Flow/components/RecorderNode/constants/handles';
import AppViewStudyViewExpertViewHeaderComponentExportMenuComponent from './components/ExportMenu/ExportMenu';
import { AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentData } from '../Flow/components/SynopticCameraNode/SynopticCameraNode';
import { v4 as uuidv4 } from 'uuid';
import { AppViewStudyViewExpertViewFlowComponentImageNodeComponentData } from '../Flow/components/ImageNode/ImageNode';
import { AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentData } from '../Flow/components/MonitorNode/MonitorNode';
import { AppViewStudyViewExpertViewFlowComponentTextNodeComponentData } from '../Flow/components/TextNode/TextNode';
import { toast } from 'react-toastify';
import { isError } from 'lodash';
import AppViewStudyViewExpertViewHeaderComponentImportMenuComponent from './components/ImportMenu/ImportMenu';

export default function AppViewStudyViewExpertViewHeaderComponent() {
  const queryClient = useQueryClient();

  const { getNodes, getEdges, addNodes, addEdges, screenToFlowPosition } = useReactFlow();
  const { setPaneClickFunction, paneClickFunction, setModal } = useContext(ExpertStudyContext)!;

  const onLinesButtonClick = () => {
    setPaneClickFunction((func) => (func?.type !== ExpertStudyPaneClickFunctionType.LINES ? { type: ExpertStudyPaneClickFunctionType.LINES } : undefined));
  };

  const onTextButtonClick = () => {
    setPaneClickFunction((func) => (func?.type !== ExpertStudyPaneClickFunctionType.TEXT ? { type: ExpertStudyPaneClickFunctionType.TEXT } : undefined));
  };

  const onRectangleButtonClick = () => {
    setPaneClickFunction((func) =>
      func?.type !== ExpertStudyPaneClickFunctionType.RECTANGLE ? { type: ExpertStudyPaneClickFunctionType.RECTANGLE } : undefined,
    );
  };

  const onHddCalculationButtonClick = () => {
    setModal({ type: ExpertStudyModalType.HDD_CALCULATION });
  };

  const onPreConnectButtonClick = async () => {
    try {
      const nodes = getNodes();
      const recorderNodes = nodes.filter(
        (node): node is Node<AppViewStudyViewExpertViewFlowComponentRecorderNodeComponentData, 'recorder'> => node.type === 'recorder',
      );
      if (recorderNodes.length !== 1) throw new Error("Le pré-raccordement n'est possible que lorsqu'il n'y a qu'un seul enregistreur");
      const recorderNode = recorderNodes[0];
      const product = (await queryClient.ensureQueryData(queries.product.list)).find((product) => product.id === recorderNode.data.productId);
      if (!product) throw new Error('Impossible de trouver le produit');
      const recorderHandles = recordersHandlesData.find((handle) => handle.productReference === product.reference)?.handles;
      if (!recorderHandles) throw new Error('Impossible de trouver les ancrages du produit');

      let hasDonePreRecord = false;

      const edges = getEdges();

      const freeRecorderHandles = recorderHandles
        .filter(
          (handle) =>
            handle.data.type === 'RJ45' &&
            !edges.some(
              (edge) =>
                (edge.source === recorderNode.id && edge.sourceHandle === handle.id) || (edge.target === recorderNode.id && edge.targetHandle === handle.id),
            ),
        )
        .sort((a, b) => {
          const aScore = (a.position === 'top' ? -1 : a.position === 'bottom' ? 1 : 0) * (parseFloat(a.style.left?.toString() ?? '') || 0);
          const bScore = (b.position === 'top' ? -1 : b.position === 'bottom' ? 1 : 0) * (parseFloat(b.style.left?.toString() ?? '') || 0);
          return aScore - bScore;
        });

      const freeCamNodes = nodes
        .filter(
          (node): node is Node<AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentData, 'synopticCamera'> =>
            node.type === 'synopticCamera' && !edges.some((edge) => edge.source === node.id || edge.target === node.id),
        )
        .sort((a, b) => a.position.y - b.position.y);

      if (freeCamNodes.length > freeRecorderHandles.length) throw new Error("J'ai essayé mais je n'arrive pas à comprendre ce que vous attendez de moi.");

      for (let camNode of freeCamNodes) {
        addEdges({
          source: recorderNode.id,
          sourceHandle: freeRecorderHandles[0].id,
          target: camNode.id,
          targetHandle: 'x',
          animated: false,
          type: 'smoothstep',
          id: uuidv4(),
        });
        freeRecorderHandles.shift();
        hasDonePreRecord = true;
      }

      const freeRecorderLanHandle = recorderHandles.find(
        (handle) =>
          handle.data.type === 'RJ45-LAN' &&
          !edges.some(
            (edge) =>
              (edge.source === recorderNode.id && edge.sourceHandle === handle.id) || (edge.target === recorderNode.id && edge.targetHandle === handle.id),
          ),
      );
      if (freeRecorderLanHandle) {
        const freeNetworkNode = nodes.find(
          (node): node is Node<AppViewStudyViewExpertViewFlowComponentImageNodeComponentData, 'image'> =>
            node.type === 'image' &&
            (node as Node<AppViewStudyViewExpertViewFlowComponentImageNodeComponentData, 'image'>).data.image === 'https://bd.vizeo.eu/6-Photos/BOX/Box.png' &&
            !edges.some((edge) => edge.source === node.id || edge.target === node.id),
        );
        if (freeNetworkNode) {
          addEdges({
            source: recorderNode.id,
            sourceHandle: freeRecorderLanHandle.id,
            target: freeNetworkNode.id,
            targetHandle: '3',
            animated: false,
            type: 'smoothstep',
            id: uuidv4(),
          });
          hasDonePreRecord = true;
        }
      }

      const freeRecorderHdmiHandle = recorderHandles.find(
        (handle) =>
          handle.data.type === 'HDMI' &&
          !edges.some(
            (edge) =>
              (edge.source === recorderNode.id && edge.sourceHandle === handle.id) || (edge.target === recorderNode.id && edge.targetHandle === handle.id),
          ),
      );
      if (freeRecorderHdmiHandle) {
        const freeMonitorNode = nodes.find(
          (node): node is Node<AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentData, 'monitor'> =>
            node.type === 'monitor' && !edges.some((edge) => edge.source === node.id || edge.target === node.id),
        );
        if (freeMonitorNode) {
          addEdges({
            source: recorderNode.id,
            sourceHandle: freeRecorderHdmiHandle.id,
            target: freeMonitorNode.id,
            targetHandle: 'x',
            animated: false,
            type: 'smoothstep',
            id: uuidv4(),
          });
          hasDonePreRecord = true;
        }
      }

      if (!hasDonePreRecord) throw new Error("Je n'ai rien trouvé à raccorder.");

      const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
      const paneCenter = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width / 2, y: reactFlowRect.y });

      const textNode: Node<AppViewStudyViewExpertViewFlowComponentTextNodeComponentData, 'text'> = {
        id: uuidv4(),
        type: 'text',
        position: { x: paneCenter.x, y: paneCenter.y },
        data: {
          text: '<p>Câble CAT6 ou 7 - U/FTP — maxi 100 m</p>',
        },
      };
      addNodes(textNode);

      toast.success('Pré-raccordement effectué avec succès.');
    } catch (error) {
      if (isError(error)) toast.error(error.message);
    }
  };

  return (
    <div className="flex h-12 items-center justify-between border-b border-b-slate-800 px-4">
      <div className="flex items-center gap-x-2">
        <button
          type="button"
          className="btn btn-primary"
          title="Tracer des lignes"
          onClick={onLinesButtonClick}
          style={{ backgroundColor: paneClickFunction?.type === ExpertStudyPaneClickFunctionType.LINES ? '#262b42' : undefined }}
        >
          <LinesLogo stroke="white" width={16} height={16} viewBox="3 6.5 18 10" />
        </button>
        <button
          type="button"
          className="btn btn-primary"
          title="Tracer un rectangle"
          onClick={onRectangleButtonClick}
          style={{ backgroundColor: paneClickFunction?.type === ExpertStudyPaneClickFunctionType.RECTANGLE ? '#262b42' : undefined }}
        >
          <PiRectangle color="white" size={16} viewBox="24 40 208 176" />
        </button>
        <button
          type="button"
          className="btn btn-primary"
          style={{
            backgroundColor: paneClickFunction?.type === ExpertStudyPaneClickFunctionType.TEXT ? '#262b42' : undefined,
          }}
          title="Ajouter du texte"
          onClick={onTextButtonClick}
        >
          <PiTextT color="white" size={16} viewBox="48 48 160 160" />
        </button>
        <button type="button" className="btn btn-primary" onClick={onPreConnectButtonClick}>
          Pré-raccorder
        </button>
      </div>
      <div className="flex items-center gap-x-2">
        <AppViewStudyViewExpertViewHeaderComponentImportMenuComponent />
        <AppViewStudyViewExpertViewHeaderComponentExportMenuComponent />
        <button type="button" className="btn btn-primary" onClick={onHddCalculationButtonClick}>
          Calcul de disque dur
        </button>
      </div>
    </div>
  );
}
