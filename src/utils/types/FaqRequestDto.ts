import FaqAccessLevel from '../enums/FaqAccessLevel';

type FaqRequestDto = {
    title: string;
    description: string;
    accessLevel: FaqAccessLevel;
    archived: boolean;
    faqConcernedNames?: string[] | null;
};

export default FaqRequestDto;
