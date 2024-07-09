import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductProductResponseDto from '../../../../../../../../../../utils/types/ProductProductResponseDto';
import { ClickAwayListener } from '@mui/material';

export type AutomaticStudyIndependantCameraNode = Node<
  {
    model: {
      id: string;
      reference: string;
    };
    options: Array<{
      qty: number;
      reference: string | null;
      id: string;
    }>;
    name: string;
  },
  'independantNode'
>;

export default function AppViewStudyViewAutomaticViewIndependantCameraNode({ id, data }: NodeProps<AutomaticStudyIndependantCameraNode>) {
  const { setNodes, deleteElements } = useReactFlow();

  const { data: product } = useQuery({
    ...queries['product'].list,
    select: (products) => products.find((product) => product.id === data.model.id),
  });

  const [isSettingsOpened, setIsSettingsOpened] = useState(false);

  const onImageClick = () => {
    setIsSettingsOpened((prev) => !prev);
  };

  const onNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nodes) => nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, name: e.target.value } } : node)));
  };

  const onAccessoryQuantityChange = (option: ProductProductResponseDto, qty: number) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id) return node;
        const options = [...(node as AutomaticStudyIndependantCameraNode).data.options];
        const nodeOption = options.find((opt) => opt.id === option.id);
        if (nodeOption) nodeOption.qty = qty;
        else
          options.push({
            id: option.id,
            reference: option.reference,
            qty,
          });
        return { ...node, data: { ...node.data, options } };
      }),
    );
  };

  const onNodeDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <ClickAwayListener mouseEvent="onPointerDown" onClickAway={() => setIsSettingsOpened(false)}>
      <div className="relative z-[100000]">
        <p className="mb-1 h-4 text-sm">{data.model.reference ?? ''}</p>
        <div className="absolute -left-[2rem] space-y-2">
          {data.options.map(
            (option) =>
              !!option.qty && (
                <div key={option.reference}>
                  <div className="flex h-4 w-5 items-center justify-center rounded-md p-0 text-xs text-black">{`x${option.qty}`}</div>
                  <img src={`https://bd.vizeo.eu/6-Photos/${option.reference}/${option.reference}.png`} className="h-8 w-8 opacity-60" />
                </div>
              ),
          )}
        </div>
        <div className="px-1 py-1 hover:relative hover:rounded-md hover:border-2 hover:border-blue-900" onClick={onImageClick}>
          <img src={`https://bd.vizeo.eu/6-Photos/${data.model.reference}/PLUG_${data.model.reference}.png`} className="h-10 w-10" />
        </div>
        {isSettingsOpened && (
          <div className="top-100% absolute z-50 mt-1 h-fit w-[25rem] cursor-default rounded-md border-2 border-[#1a192b] bg-slate-50 px-2">
            <div className="flex items-center justify-between border-b-2 border-b-[#1a192b] p-2">
              <div className="flex items-center justify-center space-x-2">
                <AiTwotoneSetting className="fill-[#1a192b]" />
                <h3 className="text-sm font-bold text-[#1a192b]">Paramétrage de votre produit</h3>
              </div>
              <AiOutlineClose className="fill-[#1a192b]" onClick={() => setIsSettingsOpened(false)} />
            </div>
            <div>
              <div className="flex items-center justify-start space-x-2 border-b-2 border-b-[#1a192b] p-2">
                <p>Nom du produit</p>
                <input
                  type="text"
                  value={data.name}
                  onChange={onNodeNameChange}
                  placeholder={data.model.reference}
                  className="rounded-md border border-[#1a192b] p-2"
                />
              </div>
              <div className="border-b-2 border-b-[#1a192b] px-2">
                <h3>Accessoires conseillés</h3>
                <div className="flex flex-col space-y-3">
                  {product?.associatedProduct?.map((option) => {
                    const nodeOption = data.options.find((opt) => opt.id === option.id);
                    return (
                      <div key={option.id} className="flex items-center justify-start gap-x-4">
                        <div className="flex w-1/2 items-center justify-end">
                          <img src={`https://bd.vizeo.eu/6-Photos/${option.reference}/${option.reference}.png`} className="h-12 w-12 object-center" />
                          <p>{option.reference}</p>
                        </div>
                        <div className="flex w-1/2 items-center justify-start gap-x-2">
                          <button
                            disabled={!nodeOption?.qty}
                            onClick={() => onAccessoryQuantityChange(option, nodeOption!.qty - 1)}
                            className="bg-[#16204e] px-2 text-white"
                          >
                            -
                          </button>
                          <span>{nodeOption?.qty ?? 0}</span>
                          <button onClick={() => onAccessoryQuantityChange(option, (nodeOption?.qty ?? 0) + 1)} className="bg-[#16204e] px-2 text-white">
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2 px-6 py-2">
                <button onClick={() => onNodeDelete()} className="flex items-center justify-center space-x-2 rounded-md bg-[#16204e] p-2 text-sm text-white">
                  Supprimer
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}
