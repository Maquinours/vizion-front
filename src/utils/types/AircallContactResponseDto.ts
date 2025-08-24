export default interface AircallContactResponseDto {
  id: number;
  direct_link: string;
  first_name: string;
  last_name: string;
  company_name: string;
  description: string;
  information: string | null;
  is_shared: boolean;
  phone_numbers: Array<object>; // TODO: Phone numbers
  emails: Array<object>; // TODO: Emails
}
