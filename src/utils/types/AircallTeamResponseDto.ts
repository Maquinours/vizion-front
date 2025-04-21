import AircallUserResponseDto from './AircallUserResponseDto';

export default interface AircallTeamResponseDto {
  id: number;
  direct_link: string;
  name: string;
  description: string;
  created_at: string;
  users: Array<Omit<AircallUserResponseDto, 'available' | 'availability_status'>>;
}
