import { useContext } from 'react';
import ExpertStudyContext, { ExpertStudyModalType } from '../../utils/context';
import useStore, { RFState } from '../Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';

const categories: Array<{
  modalId:
    | ExpertStudyModalType.INDOOR_CAMERAS
    | ExpertStudyModalType.OUTDOOR_CAMERAS
    | ExpertStudyModalType.UNIVERSAL_CAMERAS
    | ExpertStudyModalType.MONITORS
    | ExpertStudyModalType.RECORDERS
    | ExpertStudyModalType.TRANSMITTERS
    | ExpertStudyModalType.OTHER_CAMERAS
    | ExpertStudyModalType.SERVICES;
  label: string;
  pageTypes: Array<'synoptic' | 'density'>;
  image: string;
}> = [
  {
    modalId: ExpertStudyModalType.INDOOR_CAMERAS,
    label: 'Caméras Intérieures',
    image: 'https://bd.vizeo.eu/6-Photos/DA330HD/DA330HD.png',
    pageTypes: ['synoptic', 'density'],
  },
  {
    modalId: ExpertStudyModalType.OUTDOOR_CAMERAS,
    label: 'Caméras Extérieures',
    image: 'https://bd.vizeo.eu/6-Photos/CA60HD/CA60HD.png',
    pageTypes: ['synoptic', 'density'],
  },
  {
    modalId: ExpertStudyModalType.UNIVERSAL_CAMERAS,
    label: 'Caméras Universelles FULL COLOR',
    image: 'https://bd.vizeo.eu/6-Photos/DA350PAP/DA350PAP.png',
    pageTypes: ['synoptic', 'density'],
  },
  {
    modalId: ExpertStudyModalType.MONITORS,
    label: 'Moniteurs',
    image: 'https://bd.vizeo.eu/6-Photos/MO122/MO122.png',
    pageTypes: ['synoptic'],
  },
  {
    modalId: ExpertStudyModalType.RECORDERS,
    label: 'Enregistreurs',
    image: 'https://bd.vizeo.eu/6-Photos/HD508/Site_BACK_HD508.webp',
    pageTypes: ['synoptic'],
  },
  {
    modalId: ExpertStudyModalType.TRANSMITTERS,
    label: 'Transmetteurs',
    image: 'https://bd.vizeo.eu/6-Photos/POE08/POE08.png',
    pageTypes: ['synoptic'],
  },
  {
    modalId: ExpertStudyModalType.OTHER_CAMERAS,
    label: 'Autres Caméras',
    image: 'https://bd.vizeo.eu/6-Photos/LP50/LP50.png',
    pageTypes: ['synoptic'],
  },
  {
    modalId: ExpertStudyModalType.SERVICES,
    label: 'Services',
    image: 'https://bd.vizeo.eu/6-Photos/AT1/AT1.png',
    pageTypes: ['synoptic'],
  },
];

const selector = (state: RFState) => ({
  hasPage: state.pages.length > 0,
  pageType: state.pages[state.currentPage]?.type,
});

export default function AppViewStudyViewExpertViewProductsMenuComponent() {
  const { hasPage, pageType } = useStore(useShallow(selector));

  const { setModal } = useContext(ExpertStudyContext)!;

  return (
    <div className="space-y-2 border-r border-r-slate-800">
      <h2 className="flex h-12 w-full items-center justify-center border-b border-b-slate-900 text-black">PRODUITS</h2>
      <div id="product_categories_block" className="space-y-2 px-4">
        {categories.map((category, index) => (
          <button
            key={index}
            disabled={!hasPage || !category.pageTypes.includes(pageType)}
            onClick={() => setModal({ type: category.modalId })}
            className="flex h-16 w-full content-between items-center justify-center overflow-hidden rounded-md border border-slate-800 p-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <img src={category.image} className="w-[70px]" />
            <p className="text-black-700 w-32 text-sm font-bold">{category.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
