import { ClickAwayListener } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Handle, Node, NodeProps, NodeResizer, OnResize, Position, useReactFlow } from '@xyflow/react';
import { ReactEventHandler, useState } from 'react';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentMenuComponent from './components/Menu/Menu';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';

export const isExpertStudyMonitorNode = (node: Node): node is ExpertStudyMonitorNode => {
  return (
    node.type === 'monitor' &&
    'productId' in node.data &&
    typeof node.data.productId === 'string' &&
    (!('name' in node.data) || typeof node.data.name === 'string' || node.data.name === undefined) &&
    'options' in node.data &&
    Array.isArray(node.data.options) &&
    node.data.options.every(
      (option) =>
        typeof option === 'object' &&
        !!option &&
        'id' in option &&
        typeof option.id === 'string' &&
        'quantity' in option &&
        typeof option.quantity === 'number',
    ) &&
    'size' in node.data &&
    !!node.data.size &&
    typeof node.data.size === 'object' &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number' &&
    'opacity' in node.data &&
    typeof node.data.opacity === 'number' &&
    (!('quantity' in node.data) || typeof node.data.quantity === 'number' || node.data.quantity === undefined) &&
    (!('option' in node.data) || typeof node.data.option === 'boolean' || node.data.option === undefined)
  );
};

export type ExpertStudyMonitorNode = Node<
  {
    productId: string;
    name?: string;
    options: Array<{ id: string; quantity: number }>;
    size: { width: number; height: number };
    opacity: number;
    quantity?: number;
    option?: boolean;
  },
  'monitor'
>;
export default function AppViewStudyViewExpertViewFlowComponentMonitorNodeComponent({
  id,
  selected,
  data,
  positionAbsoluteY,
  height,
}: NodeProps<ExpertStudyMonitorNode>) {
  const { updateNodeData, setNodes } = useReactFlow();

  const {
    data: { product, options },
  } = useSuspenseQuery({
    ...queries.product.list,
    staleTime: Infinity,
    select: (products) => {
      const product = products.find((product) => product.id === data.productId);
      const options = [];
      for (const option of data.options) {
        const opt = products.find((product) => product.id === option.id);
        if (opt) options.push({ product: opt, quantity: option.quantity });
      }
      return { product, options };
    },
  });

  const [showMenu, setShowMenu] = useState(false);

  const onResize: OnResize = (_event, params) => {
    updateNodeData(id, { size: { width: params.width, height: params.height } });
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, selected: true } : { ...node, selected: false })));
    setShowMenu((showMenu) => !showMenu);
  };

  const onImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    updateNodeData(id, { size: { width: e.currentTarget.offsetWidth, height: e.currentTarget.offsetHeight } });
  };

  if (!product) return;

  const name = !data.name || data.name === product.reference ? product.reference : `${data.name} (${product.reference})`;
  const title =
    `${!selected ? 'Clic gauche pour sélectionner' : 'Touche Suppr. pour supprimer les objets selectionnés'}\n` +
    `Clic droit pour ${showMenu ? 'fermer la fenêtre des' : 'accéder aux'} options du moniteur\n` +
    `Maintenez le clic gauche et déplacez la souris pour déplacer le moniteur`;
  const image = `https://bd.vizeo.eu/6-Photos/${product?.reference}/${product?.reference}.png`;
  const quantity = data.quantity ?? 1;

  return (
    <>
      <NodeResizer
        isVisible={selected ?? false}
        minWidth={50}
        minHeight={50}
        keepAspectRatio
        onResize={onResize}
        handleStyle={{ width: 10, height: 10, borderRadius: '100%' }}
      />
      <Handle
        id="x"
        type="source"
        position={Position.Left}
        style={{
          width: '0.5rem',
          height: '0.5rem',
          backgroundColor: 'green',
          zIndex: 1,
        }}
      />
      <ClickAwayListener onClickAway={() => setShowMenu(false)} mouseEvent={showMenu ? 'onPointerDown' : false}>
        <div onContextMenu={onContextMenu} className="relative z-1000000000">
          <div className="absolute left-full -z-50 ml-[5%] flex h-full flex-row items-center justify-center space-x-2 overflow-hidden p-0 text-xs">
            {options.map((option) => (
              <div key={option.product.id}>
                <span className="relative z-50 mr-2 -mb-4 inline-flex items-center rounded-full bg-amber-300 px-2 py-0.5 text-sm font-medium text-white">
                  {option.quantity}
                </span>
                <img
                  src={`https://bd.vizeo.eu/6-Photos/${option.product.reference}/${option.product.reference}.jpg`}
                  alt={`Produit ${option.product.reference}`}
                  className={'w-12 rounded-md border border-black'}
                />
              </div>
            ))}
          </div>
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
            <p className="h-4 text-sm">{name}</p>
          </div>
          <div className="flex justify-center">
            <img
              title={title}
              src={image}
              alt={`Produit ${product.reference}`}
              className={'draggable'}
              width={data.size.width}
              height={data.size.height}
              style={{ opacity: data.opacity / 100 }}
              onLoad={onImageLoad}
            />
          </div>
          {showMenu && (
            <AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentMenuComponent
              product={product}
              data={data}
              nodeId={id}
              onClose={() => setShowMenu(false)}
              nodePositionY={positionAbsoluteY}
              nodeHeight={height}
            />
          )}
        </div>
      </ClickAwayListener>
    </>
  );
}
