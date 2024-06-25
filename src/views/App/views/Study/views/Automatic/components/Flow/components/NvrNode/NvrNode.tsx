import React from 'react';
import { Handle, HandleProps, NodeProps, Position } from 'reactflow';

const HANDLES: Array<{ type: string; handles: Array<HandleProps & React.HTMLAttributes<HTMLDivElement>> }> = [
  {
    type: 'HD516PAP',
    handles: [
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '8%',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '8%',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '12%',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '12.5%',
        },
      },
      {
        id: '5',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '16.5%',
        },
      },
      {
        id: '6',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '16.5%',
        },
      },
      {
        id: '7',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '21%',
        },
      },
      {
        id: '8',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '21%',
        },
      },
      {
        id: '9',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '25.5%',
        },
      },
      {
        id: '10',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '25.5%',
        },
      },
      {
        id: '11',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '29.5%',
        },
      },
      {
        id: '12',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '29.5%',
        },
      },
      {
        id: '13',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '34.5%',
        },
      },
      {
        id: '14',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '34.5%',
        },
      },
      {
        id: '15',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '38.5%',
        },
      },
      {
        id: '16',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '38.5%',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '59.5%',
          backgroundColor: 'blue',
        },
      },
      {
        id: 'v45',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '45%',
        },
      },
    ],
  },
  {
    type: 'HD508PAP',
    handles: [
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '13%',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '19%',
        },
      },
      {
        id: '5',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '25%',
        },
      },
      {
        id: '7',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '32%',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          bottom: '-2px',
          left: '70%',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '12%',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '19%',
        },
      },
      {
        id: '6',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '25%',
        },
      },
      {
        id: '8',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '31%',
        },
      },
      {
        id: 'v45',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '40%',
        },
      },
    ],
  },
  {
    type: 'HD504PAP',
    handles: [
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '18%',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '25%',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '17%',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '24%',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '70%',
          backgroundColor: 'blue',
        },
      },
      {
        id: 'v45',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '37%',
          backgroundColor: 'blue',
        },
      },
    ],
  },
];

export type AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponentData = Readonly<{
  reference: 'HD516PAP' | 'HD504PAP' | 'HD508PAP';
}>;
export default function AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponent({
  data,
}: NodeProps<AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponentData>) {
  const handles = HANDLES.find((h) => h.type === data.reference)?.handles ?? [];

  return (
    <>
      <img src={`https://bd.vizeo.eu/6-Photos/${data.reference}/PLUG_${data.reference}.png`} className="w-48" />
      {handles.map((handle) => (
        <Handle key={handle.id} {...handle} />
      ))}
    </>
  );
}
