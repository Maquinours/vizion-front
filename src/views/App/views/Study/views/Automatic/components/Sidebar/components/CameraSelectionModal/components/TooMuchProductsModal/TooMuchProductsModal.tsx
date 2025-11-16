import ReactModal from 'react-modal';

type AppViewStudyViewAutomaticViewSidebarComponentTooMuchProductsModalComponentProps = Readonly<{
  onClose: () => void;
}>;
export default function AppViewStudyViewAutomaticViewSidebarComponentTooMuchProductsModalComponent({
  onClose,
}: AppViewStudyViewAutomaticViewSidebarComponentTooMuchProductsModalComponentProps) {
  return (
    <ReactModal
      isOpen
      className="absolute top-2/4 left-2/4 m-auto h-auto w-auto max-w-[1000px] min-w-[70%] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <div className="fixed inset-0 z-5003 flex items-center justify-center bg-slate-800/20">
        <div className="relative mx-auto mt-2 flex h-fit w-fit max-w-3xl flex-col space-y-4 rounded-md border border-[#31385a] bg-slate-50 px-2 pb-4 text-[#31385a]">
          <div className="absolute inset-x-0 h-8 bg-[#31385a] text-center text-white">Attention !</div>
          <div className="h-6" />

          <div className="flex items-center justify-between">
            <div>{"Impossible d'ajouter plus de 16 articles."}</div>
          </div>
          <div className="flex flex-col items-start justify-start space-y-2 rounded-md bg-[#31385a] p-4 text-white">
            <p>Veuillez contacter un expert</p>
          </div>
          <div className="flex items-center justify-center space-x-4 text-white">
            <button className="rounded-md bg-[#31385a] px-4 py-2 hover:bg-indigo-800" onClick={() => onClose()}>
              Valider
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
