import FormationDetailsResponseDto from './FormationDetailsResponseDto';
import UploadedFile from './UploadedFile';

type FormationResponseDto = {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  files: Record<string, UploadedFile> | null;
  archived: boolean | null;
  formationDetails: FormationDetailsResponseDto[] | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string;
  modifiedBy: string | null;
};

export default FormationResponseDto;
