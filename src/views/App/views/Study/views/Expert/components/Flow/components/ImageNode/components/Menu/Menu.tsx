import { NodeToolbar, Position, useReactFlow, useViewport } from '@xyflow/react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import { ExpertStudyImageNode } from '../../ImageNode';
import { useEffect, useMemo, useRef, useState } from 'react';

type AppViewStudyViewExpertViewFlowComponentImageNodeComponentMenuComponentProps = Readonly<{
  nodeId: string;
  data: ExpertStudyImageNode['data'];
  onClose: () => void;
  nodeHeight: number | undefined;
  nodePositionY: number;
}>;
export default function AppViewStudyViewExpertViewFlowComponentImageNodeComponentMenuComponent({
  nodeId,
  data,
  onClose,
  nodeHeight,
  nodePositionY,
}: AppViewStudyViewExpertViewFlowComponentImageNodeComponentMenuComponentProps) {
  const { updateNodeData, flowToScreenPosition } = useReactFlow();
  const { y: viewportY, zoom: viewportZoom } = useViewport();

  const ref = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);

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

  const onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { opacity: Number(e.target.value) });
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <NodeToolbar isVisible position={position} align="center" offset={offset}>
      <div ref={ref} className="nopan rounded-md border-2 border-[#1a192b] bg-slate-50 px-2">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center justify-center space-x-2">
            <AiTwotoneSetting className="fill-[#1a192b]" />
            <h3 className="text-sm font-bold text-[#1a192b]">Paramétrage de votre image</h3>
          </div>
          <AiOutlineClose className="fill-[#1a192b]" onClick={onClose} />
        </div>
        <div>
          <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] px-2 pb-2">
            <label htmlFor="opacity">Opacité :</label>
            <input id="opacity" type={'range'} min={10} max={100} value={opacity} onChange={onOpacityChange} className="flex-auto" />
            <p>{opacity}%</p>
          </div>
        </div>
      </div>
    </NodeToolbar>
  );
}
