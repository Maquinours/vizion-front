type FormationDetailsResponseDto = {
  id: string;
  title: string | null;
  formationDate: string | null;
  trainers: Record<string, { value: string; label: string }> | null;
  startTime: string | null;
  endTime: string | null;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string;
};

export default FormationDetailsResponseDto;
