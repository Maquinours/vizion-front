import { NodeToolbar, Position, useReactFlow, useViewport } from '@xyflow/react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import ProductProductResponseDto from '../../../../../../../../../../../../utils/types/ProductProductResponseDto';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import { ExpertStudyMonitorNode } from '../../MonitorNode';
import { OnValueChange } from 'react-number-format';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import { useMemo } from 'react';

type Option = {
  product: ProductProductResponseDto;
  quantity: number;
};

type AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentMenuComponentProps = Readonly<{
  product: ProductResponseDto;
  data: ExpertStudyMonitorNode['data'];
  nodeId: string;
  onClose: () => void;
  nodeHeight: number | undefined;
  nodePositionY: number;
}>;
export default function AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentMenuComponent({
  product,
  data,
  nodeId,
  onClose,
  nodeHeight,
  nodePositionY,
}: AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentMenuComponentProps) {
  const { updateNodeData, flowToScreenPosition } = useReactFlow();
  const { y: viewportY, zoom: viewportZoom } = useViewport();

  const quantity = data.quantity ?? 1;

  const options: Array<Option> | undefined = product.associatedProduct
    ?.map((option) => ({
      product: option,
      quantity: data.options.find((opt) => opt.id === option.id)?.quantity ?? 0,
    }))
    .sort((a, b) => (a.product.reference ?? '').localeCompare(b.product.reference ?? ''));

  const position = useMemo(() => {
    if (nodeHeight !== undefined) {
      const flowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
      const flowCenterY = flowRect.y + flowRect.height / 2;
      const nodeCenter = flowToScreenPosition({ x: 0, y: nodePositionY + nodeHeight / 2 });
      if (nodeCenter.y >= flowCenterY) return Position.Top;
    }
    return Position.Bottom;
  }, [viewportY, viewportZoom, nodePositionY, nodeHeight]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { name: e.target.value });
  };

  const onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { opacity: Number(e.target.value) });
  };

  const onOptionDecrementQuantity = (option: Option) => {
    const options = [...data.options];
    const opt = options.find((opt) => opt.id === option.product.id);
    if (!opt) return;
    if (opt.quantity <= 1) options.splice(options.indexOf(opt), 1);
    else opt.quantity--;
    updateNodeData(nodeId, { options });
  };

  const onOptionIncrementQuantity = (option: Option) => {
    const options = [...data.options];
    const opt = options.find((opt) => opt.id === option.product.id);
    if (!opt) options.push({ id: option.product.id, quantity: 1 });
    else opt.quantity++;
    updateNodeData(nodeId, { options });
  };

  const onQuantityChange: OnValueChange = (v, info) => {
    if (v.floatValue !== undefined && info.source === 'event') {
      const quantity = v.floatValue;
      const data: { quantity: number; opacity?: number } = { quantity: quantity };
      if (quantity === 0) data.opacity = 50;
      updateNodeData(nodeId, data);
    }
  };

  return (
    <NodeToolbar position={position} align="center" className="nopan rounded-md border-2 border-[#1a192b] bg-slate-50 px-2">
      <div className="flex items-center justify-between border-b-2 border-b-[#1a192b] p-2">
        <div className="flex items-center justify-center space-x-2">
          <AiTwotoneSetting className="fill-[#1a192b]" />
          <h3 className="text-sm font-bold text-[#1a192b]">Paramétrage de votre produit {product.reference}</h3>
        </div>
        <AiOutlineClose className="fill-[#1a192b]" onClick={() => onClose()} />
      </div>
      <div>
        <div className="flex items-center justify-start space-x-2 border-b-2 border-b-[#1a192b] p-2">
          <p>Nom du moniteur</p>
          <input
            type="text"
            value={data.name || product.reference || ''}
            onChange={onNameChange}
            placeholder="Choisir un nom"
            className="rounded-md border border-[#1a192b] p-2"
          />
        </div>
        <div className="flex items-center justify-start space-x-2 border-b-2 border-b-[#1a192b] p-2">
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
        {!!options && options.length > 0 && (
          <div className="border-b-[#1a192b] px-2 pb-2 text-center">
            <h3>Accessoires conseillés</h3>
            <div className="flex h-auto flex-col items-center justify-center space-y-1">
              {options.map((option) => (
                <div key={option.product.id} className="flex items-center justify-start space-x-4">
                  <img src={`https://bd.vizeo.eu/6-Photos/${option.product.reference}/${option.product.reference}.jpg`} className="h-6 w-6 object-center" />
                  <p className="w-20">{option.product.reference}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      disabled={option.quantity === 0}
                      onClick={() => onOptionDecrementQuantity(option)}
                      className="bg-[#16204e] px-2 text-white disabled:bg-[#676A83]"
                    >
                      -
                    </button>
                    <span>{option.quantity}</span>
                    <button onClick={() => onOptionIncrementQuantity(option)} className="bg-[#16204e] px-2 text-white">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] px-2 pb-2">
          <label>Opacité :</label>
          <input type={'range'} min={10} max={100} value={data.opacity} onChange={onOpacityChange} className="flex-auto" />
          <p>{data.opacity}%</p>
        </div>
      </div>
    </NodeToolbar>
  );
}
