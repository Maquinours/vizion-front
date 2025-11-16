import { Panel } from '@xyflow/react';
import LogoIdentification from '../../../../../../../../../../assets/images/identification.svg?react';
import LogoLecturePlaque from '../../../../../../../../../../assets/images/lecture_plaque.svg?react';
import LogoReconnaissance from '../../../../../../../../../../assets/images/reconnaissance.svg?react';
import useStore, { RFState } from '../../utils/store';
import { useShallow } from 'zustand/react/shallow';
import DensityColors from '../../utils/enums/DensityColors';

// purple; cornflowerblue; lightgreen

const DENSITY_COLORS_DATA = [
  {
    type: DensityColors.DEFAULT,
    colors: {
      identification: '#101735',
      reading: '#6F7592',
      recognition: '#EAEAEF',
    },
  },
  {
    type: DensityColors.COLORED,
    colors: {
      identification: 'purple',
      reading: 'cornflowerblue',
      recognition: 'lightgreen',
    },
  },
];

const selector = (state: RFState) => {
  const page = state.pages[state.currentPage];
  return {
    pageType: page.type,
    pageColor: page.type === 'density' ? (page.colors ?? DensityColors.DEFAULT) : undefined,
  };
};

export default function AppViewStudyViewExpertViewFlowComponentDensityCaptionComponent() {
  const { pageType, pageColor } = useStore(useShallow(selector));

  const colorsData = DENSITY_COLORS_DATA.find((color) => color.type === pageColor);

  if (pageType !== 'density' || !colorsData) return null;
  return (
    <Panel position="bottom-left" style={{ margin: 0 }}>
      <div className="flex gap-x-2 rounded-tr-md border-1 border-[#31385A] px-2" style={{ backgroundColor: colorsData.colors.identification }}>
        <LogoIdentification fill="white" width={24} height={24} />
        <span className="text-left text-sm font-bold text-white">Identification</span>
      </div>
      <div className="flex gap-x-2 border-1 border-[#31385A] px-2" style={{ backgroundColor: colorsData.colors.reading }}>
        <LogoLecturePlaque fill="white" width={24} height={24} />
        <span className="text-left text-sm font-bold text-white">Lecture de plaque</span>
      </div>
      <div className="flex gap-x-2 border-1 border-[#31385A] px-2" style={{ backgroundColor: colorsData.colors.recognition }}>
        <LogoReconnaissance fill="black" width={24} height={24} />
        <span className="text-left text-sm font-bold text-black">Reconnaissance</span>
      </div>
    </Panel>
  );
}

export { DENSITY_COLORS_DATA };
