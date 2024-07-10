import { NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import React from 'react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import ProductProductResponseDto from '../../../../../../../../../../../../utils/types/ProductProductResponseDto';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import { ExpertStudySynopticCameraNode } from '../../SynopticCameraNode';

type Option = {
  product: ProductProductResponseDto;
  quantity: number;
};

type AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentMenuComponentProps = Readonly<{
  nodeId: string;
  product: ProductResponseDto;
  data: ExpertStudySynopticCameraNode['data'];
  onClose: () => void;
}>;
export default function AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentMenuComponent({
  nodeId,
  product,
  data,
  onClose,
}: AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentMenuComponentProps) {
  const { updateNodeData } = useReactFlow();

  const options: Array<Option> | undefined = product.associatedProduct
    ?.map((option) => ({
      product: option,
      quantity: data.options.find((opt) => opt.id === option.id)?.quantity ?? 0,
    }))
    .sort((a, b) => (a.product.reference ?? '').localeCompare(b.product.reference ?? ''));

  const onNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <NodeToolbar position={Position.Bottom} align="center" className="nopan rounded-md border-2 border-[#1a192b] bg-slate-50 px-2">
      <div className="text-center">
        <div className="flex items-center justify-between border-b-2 border-b-[#1a192b] p-2">
          <AiTwotoneSetting className="fill-[#1a192b]" />
          <p className="text-sm font-bold text-[#1a192b]">Paramètrage de votre produit {product.reference}</p>
          <AiOutlineClose className="fill-[#1a192b]" onClick={onClose} />
        </div>
        <div className="flex items-center justify-start space-x-2 p-2">
          <p className="text-sm">Nom de la caméra</p>
          <input
            type="text"
            value={data.name || product.reference || ''}
            onChange={onNodeNameChange}
            // onMouseDown={saveCurrentState}
            placeholder="Choisir un nom"
            className="nokey rounded-md border border-[#1a192b] p-2"
          />
        </div>
        {!!options && options.length > 0 && (
          <div className="border-t-2 border-t-[#1a192b] px-2 pb-2">
            <p>Accessoires</p>
            <div>
              {options?.map((option) => (
                <div key={option.product.id} className="flex items-center justify-center space-x-4">
                  <p className="w-20">{option.product.reference}</p>
                  <img src={`https://bd.vizeo.eu/6-Photos/${option.product.reference}/${option.product.reference}.png`} className="h-12 w-12" />
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      disabled={option.quantity === 0}
                      onClick={() => onOptionDecrementQuantity(option)}
                      className="bg-[#16204e] px-2 text-white"
                    >
                      -
                    </button>
                    <span>{option.quantity}</span>
                    <button type="button" onClick={() => onOptionIncrementQuantity(option)} className="bg-[#16204e] px-2 text-white">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] px-2 pb-2">
        <label>Opacité :</label>
        <input
          type={'range'}
          min={10}
          max={100}
          value={data.opacity}
          onChange={onOpacityChange}
          //  onMouseDown={saveCurrentState}
          className="flex-auto"
        />
        <p>{data.opacity}%</p>
      </div>
    </NodeToolbar>
  );
}
