import classNames from 'classnames';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useContext } from 'react';
import 'react-quill/dist/quill.snow.css';
import { NodeProps } from 'reactflow';
import ExpertStudyContext, { ExpertStudyModalType } from '../../../../utils/context';

export type AppViewStudyViewExpertViewFlowComponentTextNodeComponentData = Readonly<{
  text: string;
}>;
export default function AppViewStudyViewExpertViewFlowComponentTextNodeComponent({
  id,
  data,
  selected,
}: NodeProps<AppViewStudyViewExpertViewFlowComponentTextNodeComponentData>) {
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
