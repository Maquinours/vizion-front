import { NodeToolbar, Position, useReactFlow, useViewport } from '@xyflow/react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import { ExpertStudyServiceNode } from '../../ServiceNode';
import { OnValueChange } from 'react-number-format';
import { useMemo } from 'react';

type AppViewStudyViewExpertViewFlowComponentServiceNodeComponentMenuComponentProps = Readonly<{
  nodeId: string;
  data: ExpertStudyServiceNode['data'];
  onClose: () => void;
  nodeHeight: number | undefined;
  nodePositionY: number;
}>;
export default function AppViewStudyViewExpertViewFlowComponentServiceNodeComponentMenuComponent({
  nodeId,
  data,
  onClose,
  nodeHeight,
  nodePositionY,
}: AppViewStudyViewExpertViewFlowComponentServiceNodeComponentMenuComponentProps) {
  const { updateNodeData, flowToScreenPosition } = useReactFlow();
  const { y: viewportY, zoom: viewportZoom } = useViewport();

  const quantity = data.quantity ?? 1;
  const opacity = data.opacity ?? 100;

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

  return (
    <NodeToolbar isVisible position={position} align="center" className="nopan rounded-md border-2 border-[#1a192b] bg-slate-50 px-2">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center justify-center space-x-2">
          <AiTwotoneSetting className="fill-[#1a192b]" />
          <h3 className="text-sm font-bold text-[#1a192b]">Paramétrage de votre service</h3>
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
          <label>Opacité :</label>
          <input type="range" min={10} max={100} value={opacity} onChange={onOpacityChange} className="flex-auto" />
          <p>{opacity}%</p>
        </div>
        <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] p-2">
          <label htmlFor="option">Option :</label>
          <input id="option" type={'checkbox'} checked={data.option} onChange={onOptionChange} className="flex-auto" />
        </div>
      </div>
    </NodeToolbar>
  );
}
