import { useState } from 'react';
import AppViewBusinessViewBpViewTravelVoucherModalViewFormModalComponent from './components/FormModal/FormModal';
import AppViewBusinessViewBpViewTravelVoucherModalViewShowModalComponent from './components/ShowModal/ShowModal';

export default function AppViewBusinessViewBpViewTravelVoucherModalView() {
  const [step, setStep] = useState<0 | 1>(0);
  const [data, setData] = useState<Array<File>>();

  const onGenerated = (files: Array<File>) => {
    setData(files);
    setStep(1);
  };

  return (
    <>
      <AppViewBusinessViewBpViewTravelVoucherModalViewFormModalComponent show={step === 0} onGenerated={onGenerated} />
      <AppViewBusinessViewBpViewTravelVoucherModalViewShowModalComponent show={step === 1} onClose={() => setStep(0)} data={data} />
    </>
  );
}
