import { useQuery } from '@tanstack/react-query';
import { NodeProps, useReactFlow, Node } from '@xyflow/react';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { ClickAwayListener } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AutomaticStudyMonitorNode = Node<{}, 'automatiqueTvNode'>;
export default function AppViewStudyViewAutomaticViewFlowComponentMonitorNodeComponent({ id }: NodeProps) {
  const { deleteElements } = useReactFlow();

  const [isSettingsOpened, setIsSettingsOpened] = useState(false);

  const { data: product } = useQuery({
    ...queries['product'].list,
    select: (products) => products.find((product) => product.id === id),
  });

  if (product)
    return (
      <ClickAwayListener mouseEvent="onPointerDown" onClickAway={() => setIsSettingsOpened(false)}>
        <div className="relative">
          <div>
            <div className="text-center">{product.reference}</div>
            <button
              type="button"
              onClick={() => setIsSettingsOpened((prev) => !prev)}
              className="hover:relative hover:rounded-md hover:border-2 hover:border-blue-900"
            >
              <img src={`https://bd.vizeo.eu/6-Photos/${product.reference}/${product.reference}.png`} alt={`Produit ${product.reference}`} className="w-20" />
            </button>
          </div>
          {isSettingsOpened && (
            <div className="mt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  deleteElements({ nodes: [{ id }] });
                }}
                className="rounded-md bg-indigo-900 px-4 py-1 text-white"
              >
                <MdDelete />
              </button>
            </div>
          )}
        </div>
      </ClickAwayListener>
    );
}
