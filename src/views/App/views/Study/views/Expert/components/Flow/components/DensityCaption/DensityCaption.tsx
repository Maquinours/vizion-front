import { Panel } from '@xyflow/react';
import LogoIdentification from '../../../../../../../../../../assets/images/identification.svg?react';
import LogoLecturePlaque from '../../../../../../../../../../assets/images/lecture_plaque.svg?react';
import LogoReconnaissance from '../../../../../../../../../../assets/images/reconnaissance.svg?react';
import useStore, { RFState } from '../../utils/store';
import { useShallow } from 'zustand/react/shallow';

const selector = (state: RFState) => ({
  pageType: state.pages[state.currentPage].type,
});

export default function AppViewStudyViewExpertViewFlowComponentDensityCaptionComponent() {
  const { pageType } = useStore(useShallow(selector));

  if (pageType !== 'density') return null;
  return (
    <Panel position="bottom-left" style={{ margin: 0 }}>
      <div className="border-1 flex gap-x-2 rounded-tr-md border-[#31385A] bg-[#101735] px-2">
        <LogoIdentification fill="white" width={24} height={24} />
        <span className="text-left text-sm font-bold text-white">Identification</span>
      </div>
      <div className="border-1 flex gap-x-2 border-[#31385A] bg-[#6F7592] px-2">
        <LogoLecturePlaque fill="white" width={24} height={24} />
        <span className="text-left text-sm font-bold text-white">Lecture de plaque</span>
      </div>
      <div className="border-1 flex gap-x-2 border-[#31385A] bg-[#EAEAEF] px-2">
        <LogoReconnaissance fill="black" width={24} height={24} />
        <span className="text-left text-sm font-bold text-black">Reconnaissance</span>
      </div>
    </Panel>
  );
}
