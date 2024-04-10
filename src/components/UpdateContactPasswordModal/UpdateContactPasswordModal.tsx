import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { queries } from '../../utils/constants/queryKeys';
import ProfileResponseDto from '../../utils/types/ProfileResponseDto';
import UpdateContactPasswordModalComponentStepOneComponent from './components/StepOne/StepOne';
import UpdateContactPasswordModalComponentStepThreeComponent from './components/StepThree/StepThree';
import UpdateContactPasswordModalComponentStepTwoComponent from './components/StepTwo/StepTwo';

type UpdateContactPasswordModalComponentProps = Readonly<{
  contactId: string;
  onClose: () => void;
}>;
export default function UpdateContactPasswordModalComponent({ contactId, onClose }: UpdateContactPasswordModalComponentProps) {
  const queryClient = useQueryClient();

  const [step, setStep] = useState<0 | 1 | 2>(0);

  const { data: contact } = useSuspenseQuery(queries.profiles.detail(contactId));

  const onAfterUpdate = (contact: ProfileResponseDto) => {
    queryClient.setQueryData(queries.profiles.detail(contactId).queryKey, contact);
    setStep(1);
  };

  const onConfirmStepTwo = () => {
    setStep(2);
  };

  switch (step) {
    case 0:
      return <UpdateContactPasswordModalComponentStepOneComponent contact={contact} onAfterUpdate={onAfterUpdate} onClose={onClose} />;
    case 1:
      return <UpdateContactPasswordModalComponentStepTwoComponent onConfirm={onConfirmStepTwo} onClose={onClose} />;
    case 2:
      return <UpdateContactPasswordModalComponentStepThreeComponent contact={contact} onClose={onClose} />;
  }
}
