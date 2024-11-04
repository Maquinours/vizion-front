import { Handle, Position, Node } from '@xyflow/react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AutomaticStudyBoxNode = Node<{}, 'boxNode'>;
export default function AppViewStudyViewAutomaticViewFlowComponentBoxNodeComponent() {
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
        <img className="relative h-24 w-36" src="https://bd.vizeo.eu/6-Photos/BOX/Box.png" alt="Box internet" />
      </div>
    </>
  );
}
