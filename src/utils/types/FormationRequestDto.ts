import FormationDetailsRequestDto from './FormationDetailsRequestDto';

type FormationRequestDto = {
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  files?: Record<string, object> | null;
  archived?: boolean | null;
  formationDetails?: FormationDetailsRequestDto[] | null;
};

export default FormationRequestDto;
