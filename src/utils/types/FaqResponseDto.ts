import FaqAccessLevel from '../enums/FaqAccessLevel';
import FaqConcernedResponseDto from './FaqConcernedResponseDto';

type FaqResponseDto = {
    id: string;
    title: string;
    description: string;
    accessLevel: FaqAccessLevel;
    archived: boolean;
    faqConcerneds: FaqConcernedResponseDto[] | null;
    createdDate: Date;
    modifiedDate: Date | null;
    createdBy: string | null;
    modifiedBy: string | null;
};

export default FaqResponseDto;
