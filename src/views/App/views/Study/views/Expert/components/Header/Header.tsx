import { useContext } from 'react';
import { PiTextT } from 'react-icons/pi';
import ExpertStudyContext, { ExpertStudyPaneClickFunctionType } from '../../utils/context';

export default function AppViewStudyViewExpertViewHeaderComponent() {
  const { setPaneClickFunction, paneClickFunction } = useContext(ExpertStudyContext)!;

  const onTextButtonClick = () => {
    setPaneClickFunction((func) => (func?.type !== ExpertStudyPaneClickFunctionType.TEXT ? { type: ExpertStudyPaneClickFunctionType.TEXT } : undefined));
  };

  return (
    <div className="flex h-12 items-center justify-between border-b border-b-slate-800 px-4">
      <button
        type="button"
        className="btn btn-primary"
        style={{
          backgroundColor: paneClickFunction?.type === ExpertStudyPaneClickFunctionType.TEXT ? '#262b42' : undefined,
        }}
        title="Ajouter du texte"
        onClick={onTextButtonClick}
      >
        <PiTextT color="white" size={16} viewBox="48 48 160 160" />
      </button>
    </div>
  );
}
