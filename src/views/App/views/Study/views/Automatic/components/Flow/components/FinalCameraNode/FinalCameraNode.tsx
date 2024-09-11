import { useMemo } from 'react';
import { Handle, NodeProps, Position, Node } from '@xyflow/react';

export type AutomaticStudyFinalCameraNode = Node<
  {
    options: Array<{
      qty: number;
      reference: string | null;
    }>;
    model: {
      reference: string;
    };
    width: number;
    height: number;
  },
  'finalNode'
>;

export default function AppViewStudyViewAutomaticViewFlowComponentFinalCameraNodeComponent({ data }: NodeProps<AutomaticStudyFinalCameraNode>) {
  const options = useMemo(() => data.options.filter((option) => option.qty > 0), [data.options]);

  return (
    <>
      <div className="relative">
        <div className="absolute -left-[2rem] space-y-2">
          {options.map((option) => (
            <div key={option.reference}>
              <div className="flex h-8 w-8 items-center justify-center rounded-md p-0 text-xs text-black">x{option.qty}</div>
              <img
                src={`https://bd.vizeo.eu/6-Photos/${option.reference}/${option.reference}.jpg`}
                className="h-8 w-8"
                // style={{
                //   opacity: !camInfos.optionsIsOption ? '100%' : '60%',
                // }}
              />
            </div>
          ))}
        </div>

        <div className="px-1 py-1 hover:relative hover:rounded-md hover:border-2 hover:border-blue-900">
          <img src={`https://bd.vizeo.eu/6-Photos/${data.model.reference}/PLUG_${data.model.reference}.png`} width={data.width} height={data.height} />
        </div>
      </div>
      <Handle
        id="x"
        type="source"
        position={Position.Right}
        style={{
          width: '0.5975rem',
          height: '0.250rem',
          backgroundColor: '#04CC00',
        }}
      />
    </>
  );
}
