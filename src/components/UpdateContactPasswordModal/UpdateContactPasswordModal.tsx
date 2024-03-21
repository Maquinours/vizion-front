import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { profileQueryKeys } from '../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../utils/api/profile';
import UpdateContactPasswordModalComponentStepOneComponent from './components/StepOne/StepOne';
import { useState } from 'react';
import ProfileResponseDto from '../../utils/types/ProfileResponseDto';
import UpdateContactPasswordModalComponentStepTwoComponent from './components/StepTwo/StepTwo';
import UpdateContactPasswordModalComponentStepThreeComponent from './components/StepThree/StepThree';

type UpdateContactPasswordModalComponentProps = Readonly<{
  contactId: string;
  onClose: () => void;
}>;
export default function UpdateContactPasswordModalComponent({ contactId, onClose }: UpdateContactPasswordModalComponentProps) {
  const queryClient = useQueryClient();

  const [step, setStep] = useState<0 | 1 | 2>(0);

  const { data: contact } = useSuspenseQuery({
    queryKey: profileQueryKeys.detailById(contactId),
    queryFn: () => getProfileById(contactId),
  });

  const onAfterUpdate = (contact: ProfileResponseDto) => {
    queryClient.setQueryData(profileQueryKeys.detailById(contactId), contact);
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
