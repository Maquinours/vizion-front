type FormationDetailsRequestDto = {
  title?: string | null;
  formationDate?: string | null;
  trainers?: Record<string, object> | null;
  startTime?: string | null;
  endTime?: string | null;
  formationId?: string | null;
};

export default FormationDetailsRequestDto;
