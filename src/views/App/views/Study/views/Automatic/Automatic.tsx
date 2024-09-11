import '@xyflow/react/dist/style.css';
import AppViewStudyViewAutomaticViewFlowComponent from './components/Flow/Flow';
import AppViewStudyViewAutomaticViewSidebarComponent from './components/Sidebar/Sidebar';
import AppViewStudyViewAutomaticViewHeaderComponent from './components/Header/Header';
import { ReactFlowProvider } from '@xyflow/react';
import AppViewStudyViewAutomaticViewFooterComponent from './components/Footer/Footer';
import { useState } from 'react';
import AppViewStudyViewAutomaticViewRecapComponent from './components/Recap/Recap';
import classNames from 'classnames';

export enum AutomaticStudyStep {
  One,
  Two,
}

export default function AppViewStudyViewAutomaticView() {
  const [step, setStep] = useState<AutomaticStudyStep>(AutomaticStudyStep.One);

  return (
    <ReactFlowProvider>
      <div className="flex flex-row gap-x-4">
        <div className={`relative z-0 flex h-[100%] w-[100%] space-x-2 p-0 ${classNames({ 'max-w-[calc(80vh/21*29.7)]': step === AutomaticStudyStep.Two })}`}>
          {step === AutomaticStudyStep.One && <AppViewStudyViewAutomaticViewSidebarComponent />}
          <div className="flex w-full flex-col space-y-1 p-2">
            {step === AutomaticStudyStep.One && <AppViewStudyViewAutomaticViewHeaderComponent />}
            <AppViewStudyViewAutomaticViewFlowComponent step={step} />
            <AppViewStudyViewAutomaticViewFooterComponent step={step} setStep={setStep} />
          </div>
        </div>
        {step === AutomaticStudyStep.Two && <AppViewStudyViewAutomaticViewRecapComponent />}
      </div>
    </ReactFlowProvider>
  );
}
