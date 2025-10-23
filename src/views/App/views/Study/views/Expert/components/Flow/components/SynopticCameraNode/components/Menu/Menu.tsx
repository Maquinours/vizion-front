import { NodeToolbar, Position, useReactFlow, useViewport } from '@xyflow/react';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineClose, AiTwotoneSetting } from 'react-icons/ai';
import { OnValueChange } from 'react-number-format';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import ProductProductResponseDto from '../../../../../../../../../../../../utils/types/ProductProductResponseDto';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import { ExpertStudySynopticCameraNode, ExpertStudySynopticCameraNodeOrientation } from '../../SynopticCameraNode';

type Option = {
  product: ProductProductResponseDto;
  quantity: number;
};

type AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentMenuComponentProps = Readonly<{
  nodeId: string;
  product: ProductResponseDto;
  data: ExpertStudySynopticCameraNode['data'];
  onClose: () => void;
  nodePositionY: number;
  nodeHeight: number | undefined;
}>;
export default function AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentMenuComponent({
  nodeId,
  product,
  data,
  onClose,
  nodePositionY,
  nodeHeight,
}: AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentMenuComponentProps) {
  const { updateNodeData, flowToScreenPosition, getEdges, deleteElements } = useReactFlow();
  const { y: viewportY, zoom: viewportZoom } = useViewport();

  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const [offset, setOffset] = useState<number | undefined>(undefined);
  const [images, setImages] = useState<Array<{ name: string; url: string }>>([]);

  const options: Array<Option> | undefined = product.associatedProduct
    ?.map((option) => ({
      product: option,
      quantity: data.options.find((opt) => opt.id === option.id)?.quantity ?? 0,
    }))
    .sort((a, b) => (a.product.reference ?? '').localeCompare(b.product.reference ?? ''));

  const quantity = data.quantity ?? 1;

  const orientation = 'orientation' in data ? data.orientation : undefined;

  const image = data.image ?? `https://bd.vizeo.eu/6-Photos/${product.reference}/${product.category !== 'Autres cameras' && orientation === undefined ? 'PLUG_' : ''}${product.reference}.png`;

  const position = useMemo(() => {
    if (nodeHeight !== undefined) {
      const flowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
      const flowCenterY = flowRect.y + flowRect.height / 2;
      const nodeCenter = flowToScreenPosition({ x: 0, y: nodePositionY + nodeHeight / 2 });
      if (nodeCenter.y >= flowCenterY) return Position.Top;
    }
    return Position.Bottom;
  }, [viewportY, viewportZoom, nodePositionY, nodeHeight]);

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

  const onOrientationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const orientation = isNaN(value) ? undefined : value;
    if (orientation !== undefined) {
      // If the orientation is defined, then the handle will be removed & we then should remove the edges associated to it.
      const edgesToDelete = getEdges().filter((edge) => edge.target === nodeId || edge.source === nodeId);
      deleteElements({ edges: edgesToDelete });
    }
    updateNodeData(nodeId, { orientation });
  };

  const onImageChange = (imageUrl: string) => {
    updateNodeData(nodeId, { image: imageUrl });
  };

  useEffect(() => {
    const offset = (() => {
      const element = ref;
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
  }, [ref, position, nodePositionY, nodeHeight]);

  useEffect(() => {
    (async () => {
      const baseUrl = `https://bd.vizeo.eu/6-Photos/${product.reference}/`;
      const res = await fetch(baseUrl);
      const html = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const anchors = Array.from(doc.querySelectorAll('table>tbody>tr>td>a')).slice(1);
      const checked = await Promise.all(
        anchors.map(async (a) => {
          const name = a.innerHTML;
          const url = `${baseUrl}${name}`;
          if (!url) return null;
          const response = await fetch(url, { method: 'HEAD' });
          const isImage = response.headers.get('content-type')?.startsWith('image/') === true;
          return isImage ? { name, url } : null;
        }),
      );
      setImages(checked.filter((x): x is { name: string; url: string } => x !== null));
    })();
  }, []);

  return (
    <NodeToolbar position={position} align="center" offset={offset}>
      <div ref={setRef} className="nopan rounded-md border-2 border-[#1a192b] bg-slate-50 px-2 text-center max-h-128 overflow-y-auto nowheel">
        <div className="flex items-center justify-between border-b-2 border-b-[#1a192b] p-2">
          <AiTwotoneSetting className="fill-[#1a192b]" />
          <p className="text-sm font-bold text-[#1a192b]">Paramétrage de votre produit {product.reference}</p>
          <AiOutlineClose className="fill-[#1a192b]" onClick={onClose} />
        </div>
        <div className="flex items-center justify-start space-x-2 p-2">
          <p className="flex-1 text-right text-sm">Nom de la caméra :</p>
          <input
            type="text"
            value={data.name || product.reference || ''}
            onChange={onNodeNameChange}
            // onMouseDown={saveCurrentState}
            placeholder="Choisir un nom"
            className="flex-1 rounded-md border border-[#1a192b] p-2"
          />
        </div>
        <div className="flex flex-col items-center justify-start space-x-2 gap-y-3 p-2">
          <p className="flex-1 text-right text-sm">Orientation :</p>
          <div className="flex w-full flex-1 flex-row justify-between">
            {[
              { orientation: undefined, label: 'Plug' },
              { orientation: ExpertStudySynopticCameraNodeOrientation.LEFT, label: 'Gauche' },
              { orientation: ExpertStudySynopticCameraNodeOrientation.RIGHT, label: 'Droite' },
            ].map((data) => (
              <div key={data.orientation} className="flex flex-row gap-x-1">
                <label htmlFor={`orientation-${data.orientation}`} className="flex items-center justify-center space-x-2 text-sm">
                  {data.label}
                </label>
                <input
                  type="radio"
                  id={`orientation-${data.orientation}`}
                  name="orientation"
                  value={data.orientation}
                  checked={orientation === data.orientation}
                  onChange={onOrientationChange}
                />
              </div>
            ))}
          </div>
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
            <p>Accessoires</p>
            <div>
              {options?.map((option) => (
                <div key={option.product.id} className="flex items-center justify-center space-x-4">
                  <p className="w-20">{option.product.reference}</p>
                  <img
                    src={`https://bd.vizeo.eu/6-Photos/${option.product.reference}/${option.product.reference}.png`}
                    alt={`Produit ${option.product.reference}`}
                    className="h-12 w-12"
                  />
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
        <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] px-2 pb-2">
          <label htmlFor="opacity">Opacité :</label>
          <input
            id="opacity"
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
        <div className="flex gap-x-1 border-t-2 border-t-[#1a192b] p-2">
          <label htmlFor="option">Option :</label>
          <input id="option" type={'checkbox'} checked={data.option} onChange={onOptionChange} className="flex-auto" />
        </div>
        {images.length > 0 && (
          <div className="flex gap-y-2 border-t-2 border-t-[#1a192b] p-2 flex-col items-center">
            <span>Image</span>
            {images.map((img) => (
              <button key={img.url} className='flex flex-row gap-x-2 items-center cursor-pointer' onClick={() => onImageChange(img.url)}>
                <input type='radio' name='image' value={img.url} checked={image === img.url} />
                <img src={img.url} alt={img.name} className='h-12 w-12' />
                <span className="w-40 text-left">{img.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </NodeToolbar>
  );
}
