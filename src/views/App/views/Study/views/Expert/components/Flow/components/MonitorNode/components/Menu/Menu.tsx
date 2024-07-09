import { NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import ProductProductResponseDto from '../../../../../../../../../../../../utils/types/ProductProductResponseDto';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import { ExpertStudyMonitorNode } from '../../MonitorNode';

type Option = {
  product: ProductProductResponseDto;
  quantity: number;
};

type AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentMenuComponentProps = Readonly<{
  product: ProductResponseDto;
  data: ExpertStudyMonitorNode['data'];
  nodeId: string;
  onClose: () => void;
}>;
export default function AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentMenuComponent({
  product,
  data,
  nodeId,
  onClose,
}: AppViewStudyViewExpertViewFlowComponentMonitorNodeComponentMenuComponentProps) {
  const { setNodes } = useReactFlow();

  const options: Array<Option> | undefined = product.associatedProduct
    ?.map((option) => ({
      product: option,
      quantity: data.options.find((opt) => opt.id === option.id)?.quantity ?? 0,
    }))
    .sort((a, b) => (a.product.reference ?? '').localeCompare(b.product.reference ?? ''));

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, name: e.target.value } } : node)));
  };

  const onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, opacity: Number(e.target.value) } } : node)));
  };

  const onOptionDecrementQuantity = (option: Option) => {
    if (option.quantity === 0) return;
    setNodes((nds) => {
      const node = nds.find((node): node is ExpertStudyMonitorNode => node.id === nodeId);
      if (!node) return nds;
      const opt = node.data.options.find((opt) => opt.id === option.product.id);
      if (!opt) return nds;
      if (opt.quantity === 1) node.data.options.splice(node.data.options.indexOf(opt), 1);
      else opt.quantity--;
      return structuredClone(nds);
    });
  };

  const onOptionIncrementQuantity = (option: Option) => {
    setNodes((nds) => {
      const node = nds.find((node): node is ExpertStudyMonitorNode => node.id === nodeId);
      if (!node) return nds;
      const opt = node.data.options.find((opt) => opt.id === option.product.id);
      if (!opt) node.data.options.push({ id: option.product.id, quantity: 1 });
      else opt.quantity++;
      return structuredClone(nds);
    });
  };

  return (
    <NodeToolbar position={Position.Bottom} align="center" className="nopan rounded-md border-2 border-[#1a192b] bg-slate-50 px-2">
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
            className="nokey rounded-md border border-[#1a192b] p-2"
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
