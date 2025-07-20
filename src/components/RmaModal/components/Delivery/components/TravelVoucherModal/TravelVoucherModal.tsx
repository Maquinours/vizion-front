import { useState } from 'react';
import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import RmaModalComponentDeliveryComponentTravelVoucherModalComponentFormModalComponent from './components/FormModal/FormModal';
import RmaModalComponentDeliveryComponentTravelVoucherModalComponentShowModalComponent from './components/ShowModal/ShowModal';

enum Step {
  FORM,
  SHOW,
}

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/delivery/travel-voucher');

type RmaModalComponentDeliveryComponentTravelVoucherModalComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  onClose: () => void;
}>;
export default function RmaModalComponentDeliveryComponentTravelVoucherModalComponent({
  rma,
  onClose,
}: RmaModalComponentDeliveryComponentTravelVoucherModalComponentProps) {
  //   const navigate = routeApi.useNavigate();

  const [step, setStep] = useState<Step>(Step.FORM);
  const [data, setData] = useState<Array<File>>();

  //   const { rma } = routeApi.useLoaderData();

  //   const onClose = () => {
  //     navigate({ to: '..', search: true, replace: true, resetScroll: false });
  //   };

  const onGenerated = (data: Array<File>) => {
    setData(data);
    setStep(Step.SHOW);
  };

  return (
    <>
      <RmaModalComponentDeliveryComponentTravelVoucherModalComponentFormModalComponent
        rma={rma}
        show={step === Step.FORM}
        onClose={onClose}
        onGenerated={onGenerated}
      />
      <RmaModalComponentDeliveryComponentTravelVoucherModalComponentShowModalComponent
        show={step === Step.SHOW}
        onClose={() => setStep(Step.FORM)}
        data={data}
      />
    </>
  );
}
