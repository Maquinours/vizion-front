import classNames from 'classnames';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useContext } from 'react';
import { Node, NodeProps } from '@xyflow/react';
import ExpertStudyContext, { ExpertStudyModalType } from '../../../../utils/context';

export const isExpertStudyTextNode = (node: Node): node is ExpertStudyTextNode => {
  return node.type === 'text' && 'text' in node.data && typeof node.data.text === 'string';
};

export type ExpertStudyTextNode = Node<
  {
    text: string;
  },
  'text'
>;
export default function AppViewStudyViewExpertViewFlowComponentTextNodeComponent({ id, data, selected }: NodeProps<ExpertStudyTextNode>) {
  const { setModal } = useContext(ExpertStudyContext)!;

  const onDoubleClick = () => {
    setModal({ type: ExpertStudyModalType.EDIT_TEXT, data: { nodeId: id } });
  };

  return (
    <div
      title="Double-cliquez sur le texte pour le modifier"
      className={classNames({ 'm-[-1px] rounded-md border border-black': selected })}
      onDoubleClick={onDoubleClick}
    >
      {parse(DOMPurify.sanitize(data.text))}
    </div>
  );
}
