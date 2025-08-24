export default interface AircallAvailabilitiesResponseDto {
  meta: {
    count: number;
    total: number;
    current_page: number;
    per_page: number;
    next_page_link: string | null;
    previous_page_link: string | null;
  };
  users: Array<{
    id: number;
    availability: string;
  }>;
}
