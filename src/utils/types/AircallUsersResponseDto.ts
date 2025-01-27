export default interface AircallUsersResponseDto {
  meta: {
    count: number;
    total: number;
    current_page: number;
    per_page: number;
    next_page_link: null;
    previous_page_link: null;
  };
  users: Array<{
    id: number;
    direct_link: string;
    name: string;
    email: string;
    available: string;
    availability_status: string;
    created_at: string;
    time_zone: string;
    language: string;
    substatus: string;
    wrap_up_time: number;
  }>;
}
