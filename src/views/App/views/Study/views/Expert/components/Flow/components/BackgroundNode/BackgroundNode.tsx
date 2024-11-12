import { Node, NodeProps } from '@xyflow/react';
import { useState } from 'react';
import AppViewStudyViewExpertViewFlowComponentBackgroundNodeComponentMenuComponent from './components/Menu/Menu';

export const isExpertStudyBackgroundNode = (node: Node): node is ExpertStudyBackgroundNode => {
  return (
    node.type === 'background' &&
    'image' in node.data &&
    typeof node.data.image === 'string' &&
    'width' in node.data &&
    typeof node.data.width === 'number' &&
    'height' in node.data &&
    typeof node.data.height === 'number' &&
    'scale' in node.data &&
    typeof node.data.scale === 'number' &&
    'opacity' in node.data &&
    typeof node.data.opacity === 'number' &&
    'rotation' in node.data &&
    typeof node.data.rotation === 'number'
  );
};

export type ExpertStudyBackgroundNode = Node<{ image: string; width: number; height: number; scale: number; opacity: number; rotation: number }, 'background'>;
export default function AppViewStudyViewExpertViewFlowComponentBackgroundNodeComponent({ id, data, draggable }: NodeProps<ExpertStudyBackgroundNode>) {
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>();

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = document.querySelector('.react-flow')!.getBoundingClientRect();
    setMenuPosition({ top: e.pageY - rect.top, left: e.pageX - rect.left });
  };

  return (
    <>
      <img
        src={data.image}
        alt="Importation"
        className="max-w-[inherit] object-contain"
        style={{
          width: data.width * data.scale,
          height: data.height * data.scale,
          transform: `rotate(${data.rotation}deg)`,
          opacity: data.opacity,
        }}
        onContextMenu={onContextMenu}
      />
      {menuPosition && (
        <AppViewStudyViewExpertViewFlowComponentBackgroundNodeComponentMenuComponent
          position={menuPosition}
          nodeId={id}
          draggable={draggable ?? true}
          data={data}
          onClose={() => setMenuPosition(undefined)}
        />
      )}
    </>
  );
}
