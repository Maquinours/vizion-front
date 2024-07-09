import { HandleType, Position } from '@xyflow/react';

const handlesData: Array<{
  productReference: string;
  handles: Array<{
    id: string;
    type: HandleType;
    position: Position;
    style: React.CSSProperties;
    data: { type: string };
  }>;
}> = [
  {
    productReference: 'HD504',
    handles: [
      {
        id: '2',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '18%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '24%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '70%',
          backgroundColor: 'blue',
          zIndex: 1,
        },
        data: {
          type: 'HDMI',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          bottom: '-3px',
          left: '17%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          bottom: '-3px',
          height: '8px',
          left: '24%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '5',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '37%',
          backgroundColor: 'blue',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
    ],
  },
  {
    productReference: 'HD504PAP',
    handles: [
      {
        id: '2',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '18%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '24%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '70%',
          backgroundColor: 'blue',
          zIndex: 1,
        },
        data: {
          type: 'HDMI',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          bottom: '-3px',
          left: '17%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          bottom: '-3px',
          height: '8px',
          left: '24%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '5',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '37%',
          backgroundColor: 'blue',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
    ],
  },
  {
    productReference: 'HD508',
    handles: [
      {
        id: '7',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '13%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '5',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '19%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '25%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '32%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          bottom: '-2px',
          left: '70%',
          backgroundColor: 'blue',
          zIndex: 1,
        },
        data: {
          type: 'HDMI',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '13%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '19%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '6',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '25%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '8',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '31%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'v45',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '40%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
    ],
  },
  {
    productReference: 'HD508PAP',
    handles: [
      {
        id: '7',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '13%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '5',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '19%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '25%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '32%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          bottom: '-2px',
          left: '70%',
          backgroundColor: 'blue',
          zIndex: 1,
        },
        data: {
          type: 'HDMI',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '13%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '19%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '6',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '25%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '8',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '31%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'v45',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '40%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
    ],
  },
  {
    productReference: 'HD716',
    handles: [
      {
        id: '15',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '8%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '13',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '13%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '11',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '17%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '9',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '21%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '7',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '26%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '5',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '30%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '34%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '39%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '50%',
          backgroundColor: 'red',
          zIndex: 1,
        },
        data: {
          type: 'HDMI',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '8%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '12%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '6',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '17%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '8',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '21%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '10',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '26%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '12',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '30%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '14',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '34%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '16',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '38%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'v45',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '45%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
    ],
  },
  {
    productReference: 'HD516PAP',
    handles: [
      {
        id: '15',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '8%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '13',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '13%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '11',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '17%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '9',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '21%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '7',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '26%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '5',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '30%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '34%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '39%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '50%',
          backgroundColor: 'red',
          zIndex: 1,
        },
        data: {
          type: 'HDMI',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '8%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '12%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '6',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '17%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '8',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '21%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '10',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '26%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '12',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '30%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '14',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '34%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '16',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '38%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: 'v45',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '45%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
    ],
  },
  {
    productReference: 'HD732',
    handles: [
      {
        id: '10',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '25%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '12',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '30%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          backgroundColor: 'blue',
          left: '42%',
          top: '65%',
          zIndex: 1,
        },
        data: {
          type: 'HDMI',
        },
      },
    ],
  },
  {
    productReference: 'HD764',
    handles: [
      {
        id: '10',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '25%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '12',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '30%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          backgroundColor: 'blue',
          left: '42.5%',
          top: '70%',
          zIndex: 1,
        },
        data: {
          type: 'HDMI',
        },
      },
    ],
  },
  {
    productReference: 'MX16HD',
    handles: [
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '22%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
      {
        id: 'tv',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '61%',
          backgroundColor: 'blue',
          zIndex: 1,
        },
        data: {
          type: 'HDMI',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '21.5%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45-LAN',
        },
      },
    ],
  },
];

export default handlesData;
