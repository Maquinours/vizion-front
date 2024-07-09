import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import { Node, NodeToolbar, Position, useReactFlow } from 'reactflow';
import ProductProductResponseDto from '../../../../../../../../../../../../utils/types/ProductProductResponseDto';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import { AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentData } from '../../../SynopticCameraNode/SynopticCameraNode';
import { AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponentData } from '../../TransmitterNode';

type Option = {
  product: ProductProductResponseDto;
  quantity: number;
};

type AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponentMenuComponentProps = Readonly<{
  nodeId: string;
  product: ProductResponseDto;
  data: AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponentData;
  onClose: () => void;
}>;
export default function AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponentMenuComponent({
  nodeId,
  product,
  data,
  onClose,
}: AppViewStudyViewExpertViewFlowComponentTransmitterNodeComponentMenuComponentProps) {
  const { setNodes } = useReactFlow();

  const options: Array<Option> | undefined = product.associatedProduct
    ?.map((option) => ({
      product: option,
      quantity: data.options.find((opt) => opt.id === option.id)?.quantity ?? 0,
    }))
    .sort((a, b) => (a.product.reference ?? '').localeCompare(b.product.reference ?? ''));

  const onNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, name: e.target.value } } : node)));
  };

  const onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, opacity: Number(e.target.value) } } : node)));
  };

  const onOptionDecrementQuantity = (option: Option) => {
    if (option.quantity === 0) return;
    setNodes((nds) => {
      const node: Node<AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentData> | undefined = nds.find((node) => node.id === nodeId);
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
      const node: Node<AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentData> | undefined = nds.find((node) => node.id === nodeId);
      if (!node) return nds;
      const opt = node.data.options.find((opt) => opt.id === option.product.id);
      if (!opt) node.data.options.push({ id: option.product.id, quantity: 1 });
      else opt.quantity++;
      return structuredClone(nds);
    });
  };

  const hddSlots = product.specificationProducts?.find((spec) => spec.specification?.name === 'SLOT')?.value ?? 0;
  const totalHddQuantity = options?.filter((opt) => opt.product.reference?.startsWith('DD')).reduce((acc, opt) => acc + opt.quantity, 0) ?? 0;

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
        <div className="flex items-center justify-start space-x-2 p-2">
          <p className="text-sm">Nom de l&apos;enregistreur</p>
          <input
            type="text"
            value={data.name || product.reference || ''}
            onChange={onNodeNameChange}
            placeholder="Choisir un nom"
            className="nokey rounded-md border border-[#1a192b] p-2"
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
        <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] px-2 pb-2">
          <label>Opacité :</label>
          <input type={'range'} min={10} max={100} value={data.opacity} onChange={onOpacityChange} className="flex-auto" />
          <p>{data.opacity}%</p>
        </div>
      </div>
    </NodeToolbar>
  );
}
