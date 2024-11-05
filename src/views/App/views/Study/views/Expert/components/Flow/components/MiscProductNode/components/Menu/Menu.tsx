import { NodeToolbar, Position, useReactFlow, useViewport } from '@xyflow/react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import { OnValueChange } from 'react-number-format';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ExpertStudyMiscProductNode } from '../../MiscProductNode';

type AppViewStudyViewExpertViewFlowComponentMiscProductNodeComponentMenuComponentProps = Readonly<{
  nodeId: string;
  data: ExpertStudyMiscProductNode['data'];
  onClose: () => void;
  nodeHeight: number | undefined;
  nodePositionY: number;
}>;
export default function AppViewStudyViewExpertViewFlowComponentMiscProductNodeComponentMenuComponent({
  nodeId,
  data,
  onClose,
  nodeHeight,
  nodePositionY,
}: AppViewStudyViewExpertViewFlowComponentMiscProductNodeComponentMenuComponentProps) {
  const { updateNodeData, flowToScreenPosition } = useReactFlow();
  const { y: viewportY, zoom: viewportZoom } = useViewport();

  const quantity = data.quantity ?? 1;
  const opacity = data.opacity ?? 100;

  const ref = useRef<HTMLDivElement>(null);

  const [offset, setOffset] = useState<number | undefined>(undefined);

  const position = useMemo(() => {
    if (nodeHeight !== undefined) {
      const flowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
      const flowCenterY = flowRect.y + flowRect.height / 2;
      const nodeCenter = flowToScreenPosition({ x: 0, y: nodePositionY + nodeHeight / 2 });
      if (nodeCenter.y >= flowCenterY) return Position.Top;
    }
    return Position.Bottom;
  }, [viewportY, viewportZoom, nodePositionY, nodeHeight]);

  const onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { opacity: Number(e.target.value) });
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
    const offset = (() => {
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
    })();
    setOffset(offset);
  }, [position, nodePositionY, nodeHeight]);

  return (
    <NodeToolbar isVisible position={position} align="center" offset={offset}>
      <div ref={ref} className="nopan rounded-md border-2 border-[#1a192b] bg-slate-50 px-2">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center justify-center space-x-2">
            <AiTwotoneSetting className="fill-[#1a192b]" />
            <h3 className="text-sm font-bold text-[#1a192b]">Paramétrage de votre produit</h3>
          </div>
          <AiOutlineClose className="fill-[#1a192b]" onClick={onClose} />
        </div>
        <div className="border-t-2 border-t-[#1a192b]">
          <div className="flex items-center justify-start space-x-2 p-2">
            <p className="flex-1 text-right text-sm">Quantité :</p>
            <AmountFormat
              value={quantity}
              onValueChange={onQuantityChange}
              allowNegative={false}
              decimalScale={1}
              isAllowed={(v) => v.floatValue === undefined || v.floatValue >= 0}
              displayType="input"
              className="flex-1 rounded-md border border-[#1a192b] p-2"
            />
          </div>
          <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] p-2">
            <label htmlFor="opacity">Opacité :</label>
            <input id="opacity" type="range" min={10} max={100} value={opacity} onChange={onOpacityChange} className="flex-auto" />
            <p>{opacity}%</p>
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
