import AircallCallResponseDto from './AircallCallResponseDto';

export default interface AircallCallsResponseDto {
  meta: {
    count: number;
    total: number;
    current_page: number;
    per_page: number;
    next_page_link: string | null;
    previous_page_link: string | null;
  };
  calls: Array<AircallCallResponseDto>;
}
