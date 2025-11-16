import { HandleType, Position } from '@xyflow/react';

export const handlesData: Array<{
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
    productReference: 'KITFIBRE',
    handles: [
      {
        id: '1',
        type: 'source',
        position: Position.Left,
        style: {
          width: '8px',
          height: '8px',
          top: '36%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Right,
        style: {
          width: '8px',
          height: '8px',
          top: '38%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
    ],
  },
  {
    productReference: 'POE04',
    handles: [
      {
        id: '3',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          bottom: '-3px',
          left: '22%',
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
          left: '32%',
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
          bottom: '-3px',
          height: '8px',
          left: '42%',
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
          bottom: '-3px',
          height: '8px',
          left: '52%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '7',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          bottom: '-3px',
          height: '8px',
          left: '64%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
    ],
  },
  {
    productReference: 'POE04LD',
    handles: [
      {
        id: '3',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          bottom: '-5px',
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
          bottom: '-5px',
          height: '8px',
          left: '25%',
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
          bottom: '-5px',
          height: '8px',
          left: '37.5%',
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
          bottom: '-5px',
          height: '8px',
          left: '48%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '7',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          bottom: '-5px',
          height: '8px',
          left: '60%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
    ],
  },
  {
    productReference: 'POE08',
    handles: [
      {
        id: '1',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '8.4%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '14%',
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
          left: '19.6%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '25.3%',
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
          left: '31.5%',
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
          left: '37.2%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '7',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '43%',
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
          left: '48.6%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '9',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '58%',
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
          left: '64%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
    ],
  },
  {
    productReference: 'POE16',
    handles: [
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
        id: '2',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '35.5%',
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
          left: '39%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '4',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '43%',
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
          left: '47.5%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '6',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '51.5%',
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
          left: '55%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '8',
        type: 'source',
        position: Position.Top,
        style: {
          width: '8px',
          height: '8px',
          left: '58.5%',
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
          left: '68%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '-1',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '31.5%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '-2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '35%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '-3',
        type: 'source',
        position: Position.Bottom,
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
        id: '-4',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '42.5%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '-5',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '47%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '-6',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '51%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '-7',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '54.5%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '-8',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '58.5%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '-9',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '67.5%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
    ],
  },
  {
    productReference: 'PONTWIFI',
    handles: [
      {
        id: '1',
        type: 'source',
        position: Position.Left,
        style: {
          width: '8px',
          height: '8px',
          top: '50%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Right,
        style: {
          width: '8px',
          height: '8px',
          top: '48%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
    ],
  },
  {
    productReference: 'SG05',
    handles: [
      {
        id: '1',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '17.5%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '27%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '3',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '36.5%',
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
          left: '45%',
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
          left: '54.5%',
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
          left: '64%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '7',
        type: 'source',
        position: Position.Bottom,
        style: {
          width: '8px',
          height: '8px',
          left: '72.5%',
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
          left: '82%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
    ],
  },
  {
    productReference: 'KIT50M',
    handles: [
      {
        id: '1',
        type: 'source',
        position: Position.Left,
        style: {
          width: '8px',
          height: '8px',
          top: '88%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
      {
        id: '2',
        type: 'source',
        position: Position.Right,
        style: {
          width: '8px',
          height: '8px',
          top: '88%',
          zIndex: 1,
        },
        data: {
          type: 'RJ45',
        },
      },
    ],
  },
];
