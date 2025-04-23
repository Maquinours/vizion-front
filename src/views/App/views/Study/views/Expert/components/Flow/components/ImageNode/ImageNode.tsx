import { ClickAwayListener } from '@mui/material';
import { Handle, Node, NodeProps, NodeResizer, OnResize, Position, ReactFlowState, useReactFlow, useStore, useUpdateNodeInternals } from '@xyflow/react';
import { ReactEventHandler, useRef, useState } from 'react';
import AppViewStudyViewExpertViewFlowComponentImageNodeComponentMenuComponent from './components/Menu/Menu';
import { useQuery } from '@tanstack/react-query';
import { filesQueryKeys } from '../../../../../../../../../../utils/constants/queryKeys/files';
import { isValidUrl } from '../../../../../../../../../../utils/functions/url';

export const isExpertStudyImageNode = (node: Node): node is ExpertStudyImageNode => {
  return (
    node.type === 'image' &&
    'image' in node.data &&
    typeof node.data.image === 'string' &&
    'size' in node.data &&
    !!node.data.size &&
    typeof node.data.size === 'object' &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number' &&
    (!('opacity' in node.data) || typeof node.data.opacity === 'number' || node.data.opacity === undefined) &&
    'rotation' in node.data &&
    typeof node.data.rotation === 'number'
  );
};

const handlesData = [
  {
    id: '1',
    position: Position.Top,
    excludedImages: ['https://bd.vizeo.eu/6-Photos/BOX/Box.png'],
  },
  {
    id: '2',
    position: Position.Bottom,
    excludedImages: ['https://bd.vizeo.eu/6-Photos/BOX/Box.png'],
  },
  {
    id: '3',
    position: Position.Left,
  },
  {
    id: '4',
    position: Position.Right,
    excludedImages: ['https://bd.vizeo.eu/6-Photos/BOX/Box.png'],
  },
];

const getIsConnectable = (state: ReactFlowState) => {
  return state.connection.inProgress;
};

export type ExpertStudyImageNode = Node<
  {
    image: string;
    size: { width: number; height: number };
    opacity?: number;
    rotation: number;
  },
  'image'
>;
export default function AppViewStudyViewExpertViewFlowComponentImageNodeComponent({
  id,
  selected,
  data,
  height,
  positionAbsoluteY,
}: NodeProps<ExpertStudyImageNode>) {
  const isConnectable = useStore(getIsConnectable);
  const { setNodes, updateNodeData } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const { data: image } = useQuery({ ...filesQueryKeys.base64._ctx.fromUri(data.image), staleTime: Infinity, enabled: isValidUrl(data.image) });

  const onResize: OnResize = (_event, params) => {
    updateNodeData(id, { size: { width: params.width, height: params.height } });
  };

  const [showMenu, setShowMenu] = useState(false);

  const nodeRef = useRef<HTMLDivElement>(null);

  const title =
    `${!selected ? 'Clic gauche pour sélectionner' : 'Touche Suppr. pour supprimer les objets selectionnés'}\n` +
    `Clic droit pour ${showMenu ? 'fermer la fenêtre des' : 'accéder aux'} options de l'objet\n` +
    `Maintenez le clic gauche et déplacez votre souris pour déplacer l'objet\n` +
    `Maintenez le clic droit et déplacez votre souris pour tourner l'objet`;
  const opacity = data.opacity ?? 100;

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      // right click
      setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, selected: true } : { ...node, selected: false })));
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, selected: true } : { ...node, selected: false })));
    setShowMenu(true);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      updateNodeData(id, { rotation: angle });
      updateNodeInternals(id);
    }
  };

  const onImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    updateNodeData(id, { size: { width: e.currentTarget.offsetWidth, height: e.currentTarget.offsetHeight } });
  };

  const handles = handlesData.filter((handle) => !handle.excludedImages?.includes(data.image));

  return (
    <ClickAwayListener mouseEvent={showMenu ? 'onPointerDown' : false} onClickAway={() => setShowMenu(false)}>
      <div>
        <div style={{ transform: `rotate(${data.rotation}deg)` }}>
          <NodeResizer onResize={onResize} isVisible={selected ?? false} keepAspectRatio handleStyle={{ width: 10, height: 10, borderRadius: '100%' }} />
          {handles.map((handle) => (
            <Handle
              key={handle.id}
              type="source"
              position={handle.position}
              id={handle.id}
              isConnectable={isConnectable}
              style={{
                width: handle.position === Position.Top || handle.position === Position.Bottom ? '90%' : '10%',
                height: handle.position === Position.Top || handle.position === Position.Bottom ? '10%' : '90%',
                bottom: 0,
                background: 'transparent',
                border: 0,
              }}
            />
          ))}
          <div ref={nodeRef} className="flex justify-center">
            <button className="h-fit w-fit" onMouseDown={onMouseDown} onContextMenu={onContextMenu}>
              <img
                title={title}
                src={image ?? data.image}
                alt="Importation"
                width={data.size.width}
                height={data.size.height}
                style={{ opacity: opacity / 100 }}
                onLoad={onImageLoad}
              />
            </button>
          </div>
        </div>
        {showMenu && (
          <AppViewStudyViewExpertViewFlowComponentImageNodeComponentMenuComponent
            nodeId={id}
            data={data}
            onClose={() => setShowMenu(false)}
            nodeHeight={height}
            nodePositionY={positionAbsoluteY}
          />
        )}
      </div>
    </ClickAwayListener>
  );
}
