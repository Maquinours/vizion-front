import React, { useMemo } from 'react';
import { Handle, HandleProps, NodeProps, Position } from 'reactflow';

const HANDLES: Array<{ type: string; handles: Array<HandleProps & React.HTMLAttributes<HTMLDivElement>> }> = [
  {
    type: 'enregistreur-16',
    handles: [
      {
        id: '15',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '116px',
        },
      },
      {
        id: '13',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '102px',
        },
      },
      {
        id: '11',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '89px',
        },
      },
      {
        id: '9',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '77px',
        },
      },
      {
        id: '7',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '62px',
        },
      },
      {
        id: '5',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '49px',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '36px',
        },
      },
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '25px',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '6px',
          height: '6px',
          left: '179px',
          backgroundColor: 'blue',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '24px',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '38px',
        },
      },
      {
        id: '6',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '50px',
        },
      },
      {
        id: '8',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '62px',
        },
      },
      {
        id: '10',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '77px',
        },
      },
      {
        id: '12',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '89px',
        },
      },
      {
        id: '14',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '102px',
        },
      },
      {
        id: '16',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '116px',
        },
      },
      {
        id: 'v45',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '6px',
          height: '6px',
          left: '134px',
        },
      },
    ],
  },
  {
    type: 'enregistreur-8',
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
    type: 'enregistreur-4',
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

export default function AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponent({ type }: NodeProps) {
  const image = useMemo(() => {
    switch (type) {
      case 'enregistreur-16':
        return 'https://bd.vizeo.eu/6-Photos/HD516PAP/PLUG_HD516PAP.png';
      case 'enregistreur-4':
        return 'https://bd.vizeo.eu/6-Photos/HD504PAP/PLUG_HD504PAP.png';
      case 'enregistreur-8':
        return 'https://bd.vizeo.eu/6-Photos/HD508PAP/PLUG_HD508PAP.png';
    }
  }, [type]);

  const handles = HANDLES.find((h) => h.type === type)?.handles ?? [];

  return (
    <>
      <img style={{ width: '300px' }} src={image} />
      {handles.map((handle) => (
        <Handle key={handle.id} {...handle} />
      ))}
    </>
  );
}
