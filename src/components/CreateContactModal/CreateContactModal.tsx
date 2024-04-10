import { useState } from 'react';
import ProfileResponseDto from '../../utils/types/ProfileResponseDto';
import { useSuspenseQuery } from '@tanstack/react-query';
import { enterprises } from '../../utils/constants/queryKeys/enterprise';
import CreateContactModalComponentStepOneComponent from './components/StepOne/StepOne';
import CreateContactModalComponentStepTwoComponent from './components/StepTwo/StepTwo';
import CreateContactModalComponentStepThreeComponent from './components/StepThree/StepThree';

type CreateContactModalComponentProps = Readonly<{
  onClose: () => void;
  enterpriseId: string;
}>;

export default function CreateContactModalComponent({ onClose, enterpriseId }: CreateContactModalComponentProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [contact, setContact] = useState<ProfileResponseDto>();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const onAfterCreation = (contact: ProfileResponseDto) => {
    setContact(contact);
    setStep(1);
  };

  const onConfirmStepTwo = () => {
    setStep(2);
  };

  switch (step) {
    case 0:
      return <CreateContactModalComponentStepOneComponent onAfterCreation={onAfterCreation} onClose={onClose} enterprise={enterprise!} />;
    case 1:
      return <CreateContactModalComponentStepTwoComponent onConfirm={onConfirmStepTwo} onClose={onClose} />;
    case 2:
      return <CreateContactModalComponentStepThreeComponent contact={contact!} onClose={onClose} />;
  }
}
