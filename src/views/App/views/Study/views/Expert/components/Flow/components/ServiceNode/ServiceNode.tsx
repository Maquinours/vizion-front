import { ClickAwayListener } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Node, NodeProps, NodeResizer, NodeToolbar, OnResize, Position, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { ReactEventHandler, useRef, useState } from 'react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';
import { OnValueChange } from 'react-number-format';

export const isExpertStudyServiceNode = (node: Node): node is ExpertStudyServiceNode => {
  return (
    node.type === 'service' &&
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
    typeof node.data.rotation === 'number'
  );
};

export type ExpertStudyServiceNode = Node<
  {
    productId: string;
    size: { width: number; height: number };
    opacity?: number;
    rotation: number;
    quantity?: number;
  },
  'service'
>;
export default function AppViewStudyViewExpertViewFlowComponentServiceNodeComponent({ id, selected, data }: NodeProps<ExpertStudyServiceNode>) {
  const { setNodes, updateNodeData } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const quantity = data.quantity ?? 1;

  const { data: product } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) => products.find((product) => product.id === data.productId),
  });

  const onResize: OnResize = (_event, params) => {
    updateNodeData(id, { size: { width: params.width, height: params.height } });
  };

  const onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { opacity: Number(e.target.value) });
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

  const onQuantityChange: OnValueChange = (v, info) => {
    if (v.floatValue !== undefined && info.source === 'event') {
      const quantity = v.floatValue;
      const data: { quantity: number; opacity?: number } = { quantity: quantity };
      if (quantity === 0) data.opacity = 50;
      updateNodeData(id, data);
    }
  };

  if (!product) return;

  return (
    <ClickAwayListener mouseEvent={showMenu ? 'onPointerDown' : false} onClickAway={() => setShowMenu(false)}>
      <div>
        <div style={{ transform: `rotate(${data.rotation}deg)` }}>
          <NodeResizer onResize={onResize} isVisible={selected ?? false} keepAspectRatio handleStyle={{ width: 10, height: 10, borderRadius: '100%' }} />
          <div className="absolute top-[-20px] w-full text-center">
            {!!data.quantity && data.quantity > 1 && (
              <AmountFormat
                prefix="x"
                value={data.quantity}
                displayType="text"
                className="absolute right-1 top-[calc(50%-30px)] ml-auto h-fit w-fit rounded-md bg-amber-300 p-[1px] text-center text-sm font-medium text-white"
              />
            )}
            <p className="h-4 text-sm">{product.reference}</p>
          </div>
          <div ref={nodeRef} className="flex justify-center">
            <img
              title={title}
              src={`https://bd.vizeo.eu/6-Photos/${product.reference}/${product.reference}.webp`}
              width={data.size.width}
              height={data.size.height}
              style={{ opacity: opacity / 100 }}
              onMouseDown={onMouseDown}
              onContextMenu={onContextMenu}
              onLoad={onImageLoad}
            />
          </div>
        </div>
        <NodeToolbar isVisible={showMenu} position={Position.Bottom} align="center" className="nopan rounded-md border-2 border-[#1a192b] bg-slate-50 px-2">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center justify-center space-x-2">
              <AiTwotoneSetting className="fill-[#1a192b]" />
              <h3 className="text-sm font-bold text-[#1a192b]">Paramétrage de votre service</h3>
            </div>
            <AiOutlineClose className="fill-[#1a192b]" onClick={() => setShowMenu(false)} />
          </div>
          <div className="border-t-2 border-t-[#1a192b]">
            <div className="flex items-center justify-start space-x-2 p-2">
              <p className="flex-1 text-right text-sm">Quantité :</p>
              <AmountFormat
                value={quantity}
                onValueChange={onQuantityChange}
                allowNegative={false}
                decimalScale={0}
                isAllowed={(v) => v.floatValue === undefined || v.floatValue >= 0}
                displayType="input"
                className="flex-1 rounded-md border border-[#1a192b] p-2"
              />
            </div>
            <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] px-2 pb-2">
              <label>Opacité :</label>
              <input type="range" min={10} max={100} value={opacity} onChange={onOpacityChange} className="flex-auto" />
              <p>{opacity}%</p>
            </div>
          </div>
        </NodeToolbar>
      </div>
    </ClickAwayListener>
  );
}
