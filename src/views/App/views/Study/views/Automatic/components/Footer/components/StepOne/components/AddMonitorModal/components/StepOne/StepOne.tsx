import ReactModal from 'react-modal';

type AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponentStepOneComponentProps = Readonly<{
  onClose: () => void;
  onSubmit: (answer: boolean) => void;
}>;
export default function AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponentStepOneComponent({
  onClose,
  onSubmit,
}: AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponentStepOneComponentProps) {
  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute left-2/4 top-2/4 z-[2005] m-auto h-auto -translate-x-2/4 -translate-y-2/4 rounded-[5px] bg-[#fbfcfe] p-0 opacity-100 shadow-[0px_3px_5px_#10173526]"
      overlayClassName="Overlay"
    >
      <div className="flex flex-col gap-y-4 p-8">
        <div className="text-center">
          <h6 className="font-[DIN2014] text-base font-bold text-[color:var(--primary-light)]">Souhaitez-vous ajouter un moniteur ?</h6>
        </div>
        <div className="flex items-center justify-between text-xs">
          <button type="button" className="btn btn-secondary" onClick={() => onSubmit(false)}>
            Non
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onSubmit(true)}>
            Oui
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
