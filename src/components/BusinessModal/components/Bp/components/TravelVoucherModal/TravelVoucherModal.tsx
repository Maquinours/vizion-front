import { useState } from 'react';
import BusinessModalComponentBpComponentTravelVoucherModalComponentFormModalComponent from './components/FormModal/FormModal';
import BusinessModalComponentBpComponentTravelVoucherModalComponentShowModalComponent from './components/ShowModal/ShowModal';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import BusinessBpResponseDto from '../../../../../../utils/types/BusinessBpResponseDto';

type BusinessModalComponentBpComponentTravelVoucherModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  bp: BusinessBpResponseDto;
  onClose: () => void;
}>;
export default function BusinessModalComponentBpComponentTravelVoucherModalComponent({
  business,
  bp,
  onClose,
}: BusinessModalComponentBpComponentTravelVoucherModalComponentProps) {
  const [step, setStep] = useState<0 | 1>(0);
  const [data, setData] = useState<Array<File>>();

  const onGenerated = (files: Array<File>) => {
    setData(files);
    setStep(1);
  };

  return (
    <>
      <BusinessModalComponentBpComponentTravelVoucherModalComponentFormModalComponent
        business={business}
        bp={bp}
        show={step === 0}
        onGenerated={onGenerated}
        onClose={onClose}
      />
      <BusinessModalComponentBpComponentTravelVoucherModalComponentShowModalComponent show={step === 1} onClose={() => setStep(0)} data={data} />
    </>
  );
}
