import { useQuery } from '@tanstack/react-query';
import { Handle, NodeProps, Position } from 'reactflow';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';

export default function AppViewStudyViewAutomaticViewFlowComponentFinalMonitorNodeComponent({ id }: NodeProps) {
  const { data: product } = useQuery({
    ...queries['product'].list,
    select: (products) => products.find((product) => product.id === id),
  });

  if (product)
    return (
      <>
        <Handle
          id="x"
          type="source"
          position={Position.Left}
          style={{
            width: '2.1875rem',
            height: '0.204rem',
            backgroundColor: 'black',
          }}
        />
        <div className="px-1 py-1 hover:relative hover:rounded-md hover:border-2 hover:border-blue-900">
          <img
            className="relative h-24 w-36"
            src={`https://bd.vizeo.eu/6-Photos/${product.reference}/${product.reference}.png`}
            alt={`Moniteur ${product.reference}`}
          />
        </div>
      </>
    );
}
