import { useQueryClient } from '@tanstack/react-query';
import { NodeToolbar, Position, useReactFlow, useViewport } from '@xyflow/react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import ProductProductResponseDto from '../../../../../../../../../../../../utils/types/ProductProductResponseDto';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import { ExpertStudyRecorderNode } from '../../RecorderNode';
import { OnValueChange } from 'react-number-format';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import { useEffect, useMemo, useRef, useState } from 'react';

const transformProducts = [
  { reference: 'HD504PAP', toReference: 'HD504' },
  { reference: 'HD508PAP', toReference: 'HD508' },
  { reference: 'HD516PAP', toReference: 'HD716' },
  // { value: 'HD504', transformedValue: 'HD504PAP' },
  // { value: 'HD508', transformedValue: 'HD508PAP' },
  // { value: 'HD716', transformedValue: 'HD516PAP' },
];

type Option = {
  product: ProductProductResponseDto;
  quantity: number;
};

type AppViewStudyViewExpertViewFlowComponentRecorderNodeComponentMenuComponentProps = Readonly<{
  nodeId: string;
  product: ProductResponseDto;
  data: ExpertStudyRecorderNode['data'];
  onClose: () => void;
  nodeHeight: number | undefined;
  nodePositionY: number;
}>;
export default function AppViewStudyViewExpertViewFlowComponentRecorderNodeComponentMenuComponent({
  nodeId,
  product,
  data,
  onClose,
  nodeHeight,
  nodePositionY,
}: AppViewStudyViewExpertViewFlowComponentRecorderNodeComponentMenuComponentProps) {
  const queryClient = useQueryClient();
  const { updateNodeData, flowToScreenPosition } = useReactFlow();
  const { y: viewportY, zoom: viewportZoom } = useViewport();

  const ref = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);

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

  const offset = useMemo(() => {
    const element = ref.current;
    if (!element) return;
    const flowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
    if (position === Position.Top) {
      const nodeTop = flowToScreenPosition({ x: 0, y: nodePositionY }).y;
      const top = nodeTop - element.getBoundingClientRect().height;
      return Math.min(top - flowRect.top, 10);
    } else if (position === Position.Bottom) {
      if (!nodeHeight) return;
      const nodeBottom = flowToScreenPosition({ x: 0, y: nodePositionY + nodeHeight }).y;
      const bottom = nodeBottom + element.getBoundingClientRect().height;
      return Math.min(flowRect.bottom - bottom, 10);
    }
  }, [isMounted, position, nodePositionY, nodeHeight]);

  const onNodeNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    let newProduct: ProductResponseDto | undefined = undefined;
    const transformTo =
      transformProducts.find((t) => t.reference === product.reference && !name.includes(t.reference))?.toReference ??
      transformProducts.find((t) => t.toReference === product.reference && t.reference === name)?.reference;
    if (transformTo) {
      const product = (await queryClient.ensureQueryData(queries.product.list)).find((p) => p.reference === transformTo);
      if (product) newProduct = product;
    }
    updateNodeData(nodeId, {
      name,
      productId: newProduct?.id ?? data.productId,
      options: newProduct ? data.options.filter((option) => newProduct.associatedProduct?.some((opt) => opt.id === option.id)) : data.options,
    });
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
    updateNodeData(nodeId, { options: options });
  };

  const onOptionIncrementQuantity = (option: Option) => {
    const options = [...data.options];
    const opt = options.find((opt) => opt.id === option.product.id);
    if (!opt) options.push({ id: option.product.id, quantity: 1 });
    else opt.quantity++;
    updateNodeData(nodeId, { options: options });
  };

  const onQuantityChange: OnValueChange = (v, info) => {
    if (v.floatValue !== undefined && info.source === 'event') {
      const quantity = v.floatValue;
      const data: { quantity: number; opacity?: number } = { quantity: quantity };
      if (quantity === 0) data.opacity = 50;
      updateNodeData(nodeId, data);
    }
  };

  const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { option: e.target.checked });
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const hddSlots = product.specificationProducts?.find((spec) => spec.specification?.name === 'SLOT')?.value ?? 0;
  const totalHddQuantity = options?.filter((opt) => opt.product.reference?.startsWith('DD')).reduce((acc, opt) => acc + opt.quantity, 0) ?? 0;

  return (
    <NodeToolbar position={position} align="center" offset={offset}>
      <div ref={ref} className="nopan rounded-md border-2 border-[#1a192b] bg-slate-50 px-2">
        <div className="flex items-center justify-between border-b-2 border-b-[#1a192b] p-2">
          <div className="flex items-center justify-center space-x-2">
            <AiTwotoneSetting className="fill-[#1a192b]" />
            <h3 className="text-sm font-bold text-[#1a192b]">Paramétrage de votre produit {product.reference}</h3>
          </div>
          <AiOutlineClose className="fill-[#1a192b]" onClick={() => onClose()} />
        </div>
        <div>
          <div className="flex items-center justify-start space-x-2 p-2">
            <p className="text-sm">Nom de l&apos;enregistreur</p>
            <input
              type="text"
              value={data.name || product.reference || ''}
              onChange={onNodeNameChange}
              placeholder="Choisir un nom"
              className="rounded-md border border-[#1a192b] p-2"
            />
          </div>
          <div className="flex items-center justify-start space-x-2 border-t-2 border-t-[#1a192b] p-2">
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
            <div className="border-t-2 border-t-[#1a192b] px-2 pb-2">
              <h3>
                Accessoires conseillés ({hddSlots} {hddSlots > 1 ? 'disques durs' : 'disque dur'} maximum.)
              </h3>
              <div className="flex h-auto flex-col space-y-1">
                {options.map((option) => (
                  <div key={option.product.id} className="flex items-center justify-start space-x-4">
                    <img src={`https://bd.vizeo.eu/6-Photos/${option.product.reference}/${option.product.reference}.jpg`} className="h-6 w-6 object-center" />
                    <p className="w-20">{option.product.reference}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onOptionDecrementQuantity(option)}
                        className="bg-[#16204e] px-2 text-white disabled:bg-[#676A83]"
                        disabled={option.quantity === 0}
                      >
                        -
                      </button>
                      <span>{option.quantity}</span>
                      <button
                        onClick={() => onOptionIncrementQuantity(option)}
                        className="bg-[#16204e] px-2 text-white disabled:bg-[#676A83]"
                        disabled={option.product.reference?.startsWith('DD') && hddSlots !== 0 && totalHddQuantity === hddSlots}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] p-2">
            <label>Opacité :</label>
            <input type={'range'} min={10} max={100} value={data.opacity} onChange={onOpacityChange} className="flex-auto" />
            <p>{data.opacity}%</p>
          </div>
          <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] p-2">
            <label htmlFor="option">Option :</label>
            <input id="option" type={'checkbox'} checked={data.option} onChange={onOptionChange} className="flex-auto" />
          </div>
        </div>
      </div>
    </NodeToolbar>
  );
}
