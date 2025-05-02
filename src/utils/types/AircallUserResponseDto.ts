import AircallNumberResponseDto from './AircallNumberResponseDto';

export default interface AircallUserResponseDto {
  id: number;
  direct_link: string;
  name: string;
  email: string;
  created_at: string;
  available: boolean;
  availability_status: 'available' | 'custom' | 'unavailable' | string;
  substatus: string;
  numbers: Array<AircallNumberResponseDto>;
  time_zone: string;
  language: string;
  wrap_up_time: number;
}
