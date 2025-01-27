import { MdEdit } from 'react-icons/md';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import ReactModal from 'react-modal';

type AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentResultModalComponentProps = Readonly<{
  config: {
    models: Array<{
      product: ProductResponseDto;
      quantity: number;
    }>;
    settings: {
      hoursPerDay: number;
      days: number;
      hddSpace: number;
    };
  };
  onGoToSettings: () => void;
  onGoToCameras: () => void;
  onPrevious: () => void;
  onClose: () => void;
}>;
export default function AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentResultModalComponent({
  config,
  onGoToSettings,
  onGoToCameras,
  onPrevious,
  onClose,
}: AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentResultModalComponentProps) {
  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute left-2/4 top-2/4 z-2005 m-auto h-auto w-auto min-w-[70%] max-w-[1000px] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
      overlayClassName="Overlay"
    >
      <div className="mx-auto mt-4 flex max-h-[750px] max-w-6xl flex-col space-y-2 overflow-auto rounded-md border-2 border-t-0 border-[#1a192b] bg-white pb-4">
        <h1 className="flex h-8 w-full items-center justify-center rounded-t-md bg-[#16204e] text-white">Résultat</h1>
        <div className="flex flex-col gap-4 overflow-auto p-4 pl-5 pr-5">
          <div className="grid-row-2 grid">
            <div className="flex items-center pb-4">
              <span className="pr-4 text-sm font-bold text-[#16204E]">Configuration</span>
              <div className="h-px grow bg-gray-400"></div>
              <button type="button" onClick={onGoToSettings} className="ml-1">
                <MdEdit className="fill-red-600" />
              </button>
            </div>

            <div className="align-center mx-auto flex flex-col">
              <div className="flex flex-row">
                <div className="grid grid-rows-2 border border-black p-2 text-center">
                  <AmountFormat
                    value={config.settings.days}
                    decimalScale={0}
                    suffix={config.settings.days < 2 ? ' jour' : ' jours'}
                    className="font-bold text-red-600"
                  />
                  <span>{"Durée de l'enregistrement"}</span>
                </div>
                <div className="grid grid-rows-2 border-b border-r border-t border-black p-2 text-center">
                  <AmountFormat value={config.settings.hddSpace} decimalScale={2} suffix=" To" className="font-bold text-red-600" />
                  <span>{"d'espace sur disque dur"}</span>
                </div>
              </div>
              <div className="mx-auto grid grid-rows-2 border-x border-b border-black p-2 text-center">
                <AmountFormat value={config.settings.hddSpace} decimalScale={0} suffix="h/24" className="font-bold text-red-600" />
                <span>Enregistrement quotidien</span>
              </div>
            </div>
          </div>
          <div className="grid-row-2 grid">
            <div className="flex items-center pb-4">
              <span className="pr-4 text-sm font-bold text-[#16204E]">Caméras</span>
              <div className="h-px grow bg-gray-400"></div>
              <button className="ml-1">
                <MdEdit className="fill-red-600" onClick={onGoToCameras} />
              </button>
            </div>

            <div className="grid-rows grid divide-y" style={{ marginLeft: '30%', marginRight: '30%' }}>
              {config.models.map((model) => (
                <div key={model.product.id} className="flex items-center justify-center">
                  <span className="p-2 text-red-600">{`x${model.quantity}`}</span>
                  <div className="flex items-center p-2">
                    <img
                      alt={`Caméra ${model.product.reference}`}
                      src={`https://bd.vizeo.eu/6-Photos/${model.product.reference}/${model.product.reference}.jpg`}
                      className="w-14"
                    />
                    <span className="font-bold text-[#16204E]">{model.product.reference}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 text-white">
          <button type="button" className="btn btn-secondary" onClick={onPrevious}>
            Précédent
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
