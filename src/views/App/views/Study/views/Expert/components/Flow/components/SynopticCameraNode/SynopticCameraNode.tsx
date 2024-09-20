import { ClickAwayListener } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Handle, Node, NodeProps, NodeResizer, OnResize, Position, useReactFlow } from '@xyflow/react';
import React, { ReactEventHandler, useState } from 'react';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentMenuComponent from './components/Menu/Menu';

export const isExpertStudySynopticCameraNode = (node: Node): node is ExpertStudySynopticCameraNode => {
  return (
    node.type === 'synopticCamera' &&
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
    typeof node.data.size === 'object' &&
    !!node.data.size &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number' &&
    'opacity' in node.data &&
    typeof node.data.opacity === 'number' &&
    (!('quantity' in node.data) || typeof node.data.quantity === 'number' || node.data.quantity === undefined)
  );
};

export type ExpertStudySynopticCameraNode = Node<
  {
    productId: string;
    name?: string;
    options: Array<{ id: string; quantity: number }>;
    size: { width: number; height: number };
    opacity: number;
    quantity?: number;
  },
  'synopticCamera'
>;
export default function AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponent({
  id,
  selected,
  data,
  positionAbsoluteY,
  height,
}: NodeProps<ExpertStudySynopticCameraNode>) {
  const { setNodes, updateNodeData } = useReactFlow();

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

  const title =
    `${!selected ? 'Clic gauche pour sélectionner' : 'Touche Suppr. pour supprimer les objets selectionnés'}\n` +
    `Clic droit pour ${showMenu ? 'fermer la fenêtre des' : 'accéder aux'} options de la caméra\n` +
    `Maintenez le clic gauche et déplacez la souris pour déplacer la caméra`;

  if (!product) return;

  const image = `https://bd.vizeo.eu/6-Photos/${product.reference}/${product.category !== 'Autres cameras' ? 'PLUG_' : ''}${product.reference}.png`;
  const name = !data.name || data.name === product.reference ? product.reference : `${data.name} (${product.reference})`;

  const quantity = data.quantity ?? 1;

  return (
    <>
      <NodeResizer
        // onResizeStart={onResizeStart} //TODO: maybe reimplement this
        keepAspectRatio
        isVisible={selected ?? false}
        minWidth={50}
        minHeight={50}
        onResize={onResize}
        handleStyle={{ width: 10, height: 10, borderRadius: '100%' }}
      />
      <Handle style={{ height: 10, width: 10, zIndex: 1 }} id="x" type="source" position={Position.Right} />
      <ClickAwayListener onClickAway={() => setShowMenu(false)} mouseEvent={showMenu ? 'onPointerDown' : false}>
        <div
        //  onContextMenu={onContextMenu}
        >
          <div className="flex justify-center">
            <div className="pointer-events-none absolute right-full flex h-full flex-row pr-1 text-center">
              <div className="bottom-full mr-1 flex items-center gap-1">
                {options.map((option) => (
                  <div key={option.product.id} className="relative w-[48px]">
                    <span className="absolute right-0 h-5 w-5 rounded-full bg-amber-300 text-center text-sm font-medium text-white">{option.quantity}</span>
                    <img
                      src={`https://bd.vizeo.eu/6-Photos/${option.product.reference}/${option.product.reference}.jpg`}
                      alt={`Produit ${option.product.reference}`}
                      className="w-24 rounded-md border border-black"
                    />
                  </div>
                ))}
              </div>
              <div className="my-auto ml-auto">
                {quantity !== 0 && (
                  <AmountFormat
                    prefix="x"
                    value={quantity}
                    displayType="text"
                    className="absolute right-1 top-[calc(50%-30px)] ml-auto h-fit w-fit rounded-md bg-amber-300 p-[1px] text-center text-sm font-medium text-white"
                  />
                )}
                <p className="h-4 text-sm">{name}</p>
              </div>
            </div>
            <div title={title} onContextMenu={onContextMenu}>
              <img src={image} width={data.size.width} height={data.size.height} style={{ opacity: data.opacity / 100 }} onLoad={onImageLoad} />
            </div>
          </div>
          {showMenu && (
            <AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentMenuComponent
              nodeId={id}
              product={product}
              data={data}
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
