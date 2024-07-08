import { useContext } from 'react';
import ExpertStudyContext, { ExpertStudyModalType } from '../../utils/context';

const categories: Array<{
  modalId:
    | ExpertStudyModalType.INDOOR_CAMERAS
    | ExpertStudyModalType.OUTDOOR_CAMERAS
    | ExpertStudyModalType.UNIVERSAL_CAMERAS
    | ExpertStudyModalType.MONITORS
    | ExpertStudyModalType.RECORDERS
    | ExpertStudyModalType.TRANSMITTERS
    | ExpertStudyModalType.OTHER_CAMERAS;
  label: string;
  category: string;
  image: string;
}> = [
  {
    modalId: ExpertStudyModalType.INDOOR_CAMERAS,
    label: 'Caméras Intérieures',
    category: 'cameraInterieur',
    image: 'https://bd.vizeo.eu/6-Photos/DA330HD/DA330HD.png',
  },
  {
    modalId: ExpertStudyModalType.OUTDOOR_CAMERAS,
    label: 'Caméras Extérieures',
    category: 'cameraExterieur',
    image: 'https://bd.vizeo.eu/6-Photos/CA60HD/CA60HD.png',
  },
  {
    modalId: ExpertStudyModalType.UNIVERSAL_CAMERAS,
    label: 'Caméra Universelle FULL COLOR',
    category: 'cameraUniverselle',
    image: 'https://bd.vizeo.eu/6-Photos/DA350PAP/DA350PAP.png',
  },
  {
    modalId: ExpertStudyModalType.MONITORS,
    label: 'Moniteurs',
    category: 'moniteur',
    image: 'https://bd.vizeo.eu/6-Photos/MO122/MO122.png',
  },
  {
    modalId: ExpertStudyModalType.RECORDERS,
    label: 'Enregistreur',
    category: 'enregistreur',
    image: 'https://bd.vizeo.eu/6-Photos/HD508/Site_BACK_HD508.webp',
  },
  {
    modalId: ExpertStudyModalType.TRANSMITTERS,
    label: 'Transmetteurs',
    category: 'transmetteur',
    image: 'https://bd.vizeo.eu/6-Photos/POE08/POE08.png',
  },
  {
    modalId: ExpertStudyModalType.OTHER_CAMERAS,
    label: 'Autres Caméras',
    category: 'autre',
    image: 'https://bd.vizeo.eu/6-Photos/LP50/LP50.png',
  },
];

export default function AppViewStudyViewExpertViewProductsMenuComponent() {
  const { setModal } = useContext(ExpertStudyContext)!;

  return (
    <div className=" w-[15%] space-y-2 border-r border-r-slate-800">
      <h2 className="flex  h-12 w-full items-center justify-center  border-b border-b-slate-900 text-black">PRODUITS</h2>
      <div id="product_categories_block" className="space-y-2 px-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setModal({ type: category.modalId })}
            className="flex h-16 w-full content-between items-center justify-center overflow-hidden rounded-md border border-slate-800 p-2"
          >
            <img src={category.image} className="w-[70px]" />
            <p className="text-black-700 w-32 text-sm font-bold ">{category.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}