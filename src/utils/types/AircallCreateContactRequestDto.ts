export default interface AircallCreateContactRequestDto {
  first_name?: string | null;
  last_name?: string | null;
  company_name?: string | null;
  information?: string | null;
  emails?: Array<{ label: string; value: string }> | null;
  phone_numbers: Array<{ label: string | null; value: string }> | null;
}
