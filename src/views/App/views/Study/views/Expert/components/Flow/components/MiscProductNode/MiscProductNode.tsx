import { ClickAwayListener } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Node, NodeProps, NodeResizer, OnResize, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { ReactEventHandler, useRef, useState } from 'react';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import AppViewStudyViewExpertViewFlowComponentMiscProductNodeComponentMenuComponent from './components/Menu/Menu';

export const isExpertStudyMiscProductNode = (node: Node): node is ExpertStudyMiscProductNode => {
  return (
    node.type === 'misc-product' &&
    'productId' in node.data &&
    typeof node.data.productId === 'string' &&
    'size' in node.data &&
    typeof node.data.size === 'object' &&
    !!node.data.size &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number' &&
    (!('opacity' in node.data) || typeof node.data.opacity === 'number' || node.data.opacity === undefined) &&
    'rotation' in node.data &&
    typeof node.data.rotation === 'number' &&
    (!('quantity' in node.data) || typeof node.data.quantity === 'number' || node.data.quantity === undefined) &&
    (!('option' in node.data) || typeof node.data.option === 'boolean' || node.data.option === undefined)
  );
};

export type ExpertStudyMiscProductNode = Node<
  {
    productId: string;
    size: { width: number; height: number };
    opacity?: number;
    rotation: number;
    quantity?: number;
    option?: boolean;
  },
  'misc-product'
>;
export default function AppViewStudyViewExpertViewFlowComponentMiscProductNodeComponent({
  id,
  selected,
  data,
  positionAbsoluteY,
  height,
}: NodeProps<ExpertStudyMiscProductNode>) {
  const { setNodes, updateNodeData } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const { data: product } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) => products.find((product) => product.id === data.productId),
  });

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

  if (!product) return;

  const quantity = data.quantity ?? 1;

  return (
    <ClickAwayListener mouseEvent={showMenu ? 'onPointerDown' : false} onClickAway={() => setShowMenu(false)}>
      <div>
        <div style={{ transform: `rotate(${data.rotation}deg)` }}>
          <NodeResizer onResize={onResize} isVisible={selected ?? false} keepAspectRatio handleStyle={{ width: 10, height: 10, borderRadius: '100%' }} />
          <div className="absolute top-[-20px] w-full text-center">
            <div className="absolute top-[calc(50%-30px)] right-1 ml-auto flex h-fit w-fit gap-x-1">
              {data.option && <span className="rounded-md bg-purple-300 p-[1px] text-center text-sm font-medium text-white">OPTION</span>}
              {quantity !== 0 && (
                <AmountFormat
                  prefix="x"
                  value={quantity}
                  displayType="text"
                  className="rounded-md bg-amber-300 p-[1px] text-center text-sm font-medium text-white"
                />
              )}
            </div>
            <p className="h-4 text-sm">{product.reference}</p>
          </div>
          <div ref={nodeRef} className="flex justify-center">
            <button className="h-fit w-fit" onMouseDown={onMouseDown} onContextMenu={onContextMenu}>
              <img
                title={title}
                src={`https://bd.vizeo.eu/6-Photos/${product.reference}/${product.reference}.webp`}
                alt={`Produit ${product.reference}`}
                width={data.size.width}
                height={data.size.height}
                style={{ opacity: opacity / 100 }}
                onLoad={onImageLoad}
              />
            </button>
          </div>
        </div>
        {showMenu && (
          <AppViewStudyViewExpertViewFlowComponentMiscProductNodeComponentMenuComponent
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
