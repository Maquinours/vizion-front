import { useSuspenseQuery } from '@tanstack/react-query';
import { Handle, NodeProps, NodeResizer, ResizeDragEvent, ResizeParamsWithDirection, useReactFlow } from 'reactflow';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { useState } from 'react';
import { handlesData } from './constants/handles';
import { ClickAwayListener } from '@mui/material';
import AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponentMenuComponent from './components/Menu/Menu';

export type AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponentData = Readonly<{
  productId: string;
  name?: string;
  options: Array<{ id: string; quantity: number }>;
  size: { width: number; height: number };
  opacity: number;
}>;
export default function AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponent({
  id,
  selected,
  data,
}: NodeProps<AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponentData>) {
  const { setNodes } = useReactFlow();

  const {
    data: { product, options },
  } = useSuspenseQuery({
    ...queries.product.list,
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

  const onResize = (_event: ResizeDragEvent, params: ResizeParamsWithDirection) => {
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, size: { width: params.width, height: params.height } } } : node)));
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, selected: true } : { ...node, selected: false })));
    setShowMenu((showMenu) => !showMenu);
  };

  if (!product) return null;

  const handles = handlesData.find((handle) => handle.productReference === product.reference)?.handles;
  const name = data.name || product.reference || '';
  const title =
    `${!selected ? 'Clic gauche pour sélectionner' : 'Touche Suppr. pour supprimer les objets selectionnés'}\n` +
    `Clic droit pour ${showMenu ? 'fermer la fenêtre des' : 'accéder aux'} options de l'enregistreur\n` +
    `Maintenez le clic gauche et déplacez la souris pour déplacer l'enregistreur`;

  return (
    <>
      <NodeResizer
        // onResizeStart={onResizeStart}
        isVisible={selected}
        minWidth={50}
        minHeight={50}
        keepAspectRatio
        onResize={onResize}
        handleStyle={{ width: 10, height: 10, borderRadius: '100%' }}
      />
      {handles?.map((handle) => <Handle key={handle.id} id={handle.id} position={handle.position} style={handle.style} type={handle.type} />)}
      <ClickAwayListener onClickAway={() => setShowMenu(false)} mouseEvent={showMenu ? 'onPointerDown' : false}>
        <div>
          <div></div>
          <div className="absolute left-full -z-50 ml-[5%] flex h-full flex-row items-center justify-center space-x-2 overflow-hidden p-0  text-xs">
            {options.map((option) => (
              <div>
                <span className=" relative z-[50] -mb-4 mr-2 inline-flex items-center rounded-full bg-amber-300 px-2 py-0.5 text-sm font-medium text-white">
                  {option.quantity}
                </span>
                <img
                  src={`https://bd.vizeo.eu/6-Photos/${option.product.reference}/${option.product.reference}.jpg`}
                  alt={`Produit ${option.product.reference}`}
                  className="w-12 rounded-md border border-black"
                />
              </div>
            ))}
          </div>
          <div className="absolute top-[-20px] w-full text-center">
            <p className="h-4 text-sm">{name}</p>
          </div>
          <div className="flex justify-center" onContextMenu={onContextMenu}>
            <div title={title}>
              <img
                style={{ opacity: data.opacity / 100 }}
                src={`https://bd.vizeo.eu/6-Photos/${product.reference}/PLUG_${product.reference}.png`}
                width={data.size.width}
                height={data.size.height}
              />
            </div>

            {showMenu && (
              <AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponentMenuComponent
                nodeId={id}
                product={product}
                data={data}
                onClose={() => setShowMenu(false)}
              />
            )}
          </div>
        </div>
      </ClickAwayListener>
    </>
  );
}
